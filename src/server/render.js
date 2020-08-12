/* global APP_NAME META_DESCRIPTION */

import React from 'react';
import config from 'config';
import {parse} from 'url';
import {PassThrough} from 'stream';
import {Provider} from 'react-redux';
import {renderToNodeStream} from 'react-dom/server';
import {renderStylesToNodeStream} from 'emotion-server';
import {ReportChunks} from 'react-universal-component';
import {clearChunks} from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import routesMap from '../app/routesMap';
import vendors from '../../webpack/ssr/vendors';

import App from '../app';
import configureStore from './configureStore';
import serviceWorker from './serviceWorker';
import GlobalStyles from '../app/business/common/components/globalStyles';


// override variables between same built app, but not remote API
// There are not present in the webpack definePlugin
const API_URL = config.apps.frontend.apiUrl;

const paths = Object.keys(routesMap).map((o) => routesMap[o].path);

const createApp = (App, store, chunkNames) => (
    <ReportChunks report={(chunkName) => chunkNames.push(chunkName)}>
        <Provider store={store}>
            <GlobalStyles />
            <App />
        </Provider>
    </ReportChunks>
);

const flushDll = (clientStats) => clientStats.assets.reduce((p, c) => [
    ...p,
    ...(c.name.endsWith('dll.js') ? [`<script type="text/javascript" src="/${c.name}" defer></script>`] : []),
], []).join('\n');

const earlyChunk = (styles, stateJson) => `
    <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>${APP_NAME}</title>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="mobile-web-app-capable" content="yes">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta name="description" content="${META_DESCRIPTION}"/>
          <meta name="theme-color" content="#000">
          <link rel="manifest" href="/manifest.json" crossorigin="use-credentials">
          <link rel="icon" sizes="192x192" href="launcher-icon-high-res.png">
          ${styles}
        </head>
      <body>
          <noscript>
              <div>Please enable javascript in your browser for displaying this website.</div>
          </noscript>
          <script>window.API_URL="${API_URL}";</script>
          <script>window.REDUX_STATE = ${stateJson};</script>
          ${process.env.NODE_ENV === 'production' ? '<script src="/raven.min.js" type="text/javascript" defer></script>' : ''}
          <div id="root">`,
    lateChunk = (cssHash, js, dll) => `</div>
          ${process.env.NODE_ENV === 'development' ? '<div id="devTools"></div>' : ''}
          ${cssHash}
          ${dll}
          ${js}
          ${serviceWorker}
        </body>
    </html>
  `;

const renderStreamed = async (ctx, path, clientStats, outputPath) => {
    // Grab the CSS from our sheetsRegistry.
    clearChunks();

    const store = await configureStore(ctx);

    if (!store) return; // no store means redirect was already served
    const stateJson = JSON.stringify(store.getState());

    const {css} = flushChunks(clientStats, {outputPath});

    const chunkNames = [];
    const app = createApp(App, store, chunkNames);

    const stream = renderToNodeStream(app).pipe(renderStylesToNodeStream());

    // flush the head with css & js resource tags first so the download starts immediately
    const early = earlyChunk(css, stateJson);


    const mainStream = ctx.body;

    mainStream.write(early);

    stream.pipe(mainStream, {end: false});

    stream.on('end', () => {
        const {js, cssHash} = flushChunks(clientStats,
            {
                chunkNames,
                outputPath,
                // use splitchunks in production
                ...(process.env.NODE_ENV === 'production' ? {before: ['bootstrap', ...Object.keys(vendors), 'modules']} : {}),
            });

        // dll only in development
        let dll = '';
        if (process.env.NODE_ENV === 'development') {
            dll = flushDll(clientStats);
        }

        console.log('CHUNK NAMES', chunkNames);

        const late = lateChunk(cssHash, js, dll);
        mainStream.end(late);
    });
};

export default ({clientStats, outputPath}) => async (ctx) => {
    ctx.body = new PassThrough(); // this is a stream
    ctx.status = 200;
    ctx.type = 'text/html';

    console.log('REQUESTED ORIGINAL PATH:', ctx.originalUrl);

    const url = parse(ctx.originalUrl);

    let path = ctx.originalUrl;
    // check if path is in our whitelist, else give 404 route
    if (!paths.includes(url.pathname)
        && !ctx.originalUrl.endsWith('.ico')
        && ctx.originalUrl !== 'service-worker.js'
        && !(process.env.NODE_ENV === 'development' && ctx.originalUrl.endsWith('.js.map'))) {
        path = '/404';
    }

    console.log('REQUESTED PARSED PATH:', path);

    renderStreamed(ctx, path, clientStats, outputPath);
};
