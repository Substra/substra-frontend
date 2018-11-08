/* global APP_NAME META_DESCRIPTION META_KEYWORDS */

import React from 'react';
import config from 'config';
import {parse} from 'url';
import {Transform, PassThrough} from 'stream';
import redis from 'redis';
import {Provider} from 'react-redux';
import {renderToNodeStream} from 'react-dom/server';
// import {renderToStaticMarkup} from 'react-dom/server';
import {renderStylesToNodeStream} from 'emotion-server';
// import {renderStylesToString} from 'emotion-server';
import {ReportChunks} from 'react-universal-component';
import {clearChunks} from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import {JssProvider, SheetsRegistry} from 'react-jss';
import {MuiThemeProvider, createGenerateClassName} from '@material-ui/core/styles';

import {promisify} from 'util';

import routesMap from '../app/routesMap';
import vendors from '../../webpack/ssr/vendors';

import App from '../app';
import configureStore from './configureStore';
import serviceWorker from './serviceWorker';
import raven from './raven';

import theme from '../common/theme/index';


const cache = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
});

const exists = promisify(cache.exists).bind(cache);
const get = promisify(cache.get).bind(cache);

cache.on('connect', () => {
    console.log('CACHE CONNECTED');
});

const paths = Object.keys(routesMap).map(o => routesMap[o].path);

const createCacheStream = (key) => {
    const bufferedChunks = [];
    return new Transform({
        // transform() is called with each chunk of data
        transform(data, enc, cb) {
            // We store the chunk of data (which is a Buffer) in memory
            bufferedChunks.push(data);
            // Then pass the data unchanged onwards to the next stream
            cb(null, data);
        },

        // flush() is called when everything is done
        flush(cb) {
            // We concatenate all the buffered chunks of HTML to get the full HTML
            // then cache it at "key"

            // TODO support caching with _sw-precache

            // only cache paths
            if (paths.includes(key) && !(key.endsWith('.js.map') || key.endsWith('.ico')) || key === 'service-worker.js') {
                console.log('CACHING: ', key);
                cache.set(key, Buffer.concat(bufferedChunks));
            }
            cb();
        },
    });
};

// Create a sheetsRegistry instance.
const sheetsRegistry = new SheetsRegistry();

// Create a sheetsManager instance.
const sheetsManager = new Map();

// Create a new class name generator.
const generateClassName = createGenerateClassName();

const createApp = (App, store, chunkNames) => (
    <ReportChunks report={chunkName => chunkNames.push(chunkName)}>
        <Provider store={store}>
            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
                    <App />
                </MuiThemeProvider>
            </JssProvider>
        </Provider>
    </ReportChunks>
);

const flushDll = clientStats => clientStats.assets.reduce((p, c) => [
    ...p,
    ...(c.name.endsWith('dll.js') ? [`<script type="text/javascript" src="/${c.name}" defer></script>`] : []),
], []).join('\n');

const earlyChunk = (styles, materialUiCss, stateJson) => `
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
          <meta name="keywords" content="${META_KEYWORDS}" />
          <meta name="theme-color" content="#000">
          <link rel="manifest" href="/manifest.json" crossorigin="use-credentials">
          <link rel="icon" sizes="192x192" href="launcher-icon-high-res.png">
          ${styles}
          <style id="jss-server-side">${materialUiCss}</style>
        </head>
      <body>
          <noscript>
              <div>Please enable javascript in your browser for displaying this website.</div>
          </noscript>
          <script>window.REDUX_STATE = ${stateJson}</script>
          <div id="root">`,
    lateChunk = (cssHash, js, dll) => `</div>
          ${process.env.NODE_ENV === 'development' ? '<div id="devTools"></div>' : ''}
          ${cssHash}
          ${dll}
          ${js}
          ${serviceWorker}
          <script src="/raven.min.js" type="text/javascript" defer></script>
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

    // needed for jss and server side rendering, material-ui still does not work with stream...
    // follow this issue for disabling below blocking line https://github.com/mui-org/material-ui/issues/8503
    // renderToStaticMarkup(app);

    const materialUiCss = sheetsRegistry.toString();

    // flush the head with css & js resource tags first so the download starts immediately
    const early = earlyChunk(css, materialUiCss, stateJson);


    // DO not use redis cache on dev
    let mainStream;
    if (process.env.NODE_ENV === 'development') {
        mainStream = ctx.body;
    }
    else {
        mainStream = createCacheStream(path);
        mainStream.pipe(ctx.body);
    }

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

        const late = lateChunk(cssHash, js, dll, raven);
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

    // DO not use redis cache on dev
    if (process.env.NODE_ENV === 'development') {
        renderStreamed(ctx, path, clientStats, outputPath);
    }

    else {
        const reply = await exists(path);

        if (reply === 1) {
            const reply = await get(path);

            if (reply) {
                console.log('CACHE KEY EXISTS: ', path);
                // handle status 404
                if (path === '/404') {
                    ctx.status = 404;
                }
                ctx.body.end(reply);
            }
        }

        else {
            console.log('CACHE KEY DOES NOT EXIST: ', path);
            await renderStreamed(ctx, path, clientStats, outputPath);
        }
    }
};
