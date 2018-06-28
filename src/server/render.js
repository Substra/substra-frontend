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

import routesMap from '../app/routesMap';

import App from '../app';
import configureStore from './configureStore';
import serviceWorker from './serviceWorker';
import raven from './raven';

const cache = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
});

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

            // only cache paths
            if (paths.includes(key) && !(key.endsWith('.js.map') || key.endsWith('.ico')) || key === 'service-worker.js') {
                console.log('CACHING: ', key);
                cache.set(key, Buffer.concat(bufferedChunks));
            }
            cb();
        },
    });
};

const createApp = (App, store, chunkNames) => (
    <ReportChunks report={chunkName => chunkNames.push(chunkName)}>
        <Provider store={store}>
            <App />
        </Provider>
    </ReportChunks>
);

const flushDll = clientStats => clientStats.assets.reduce((p, c) => [
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
          <meta name="keywords" content="${META_KEYWORDS}" />
          <meta name="theme-color" content="#000">
          <link rel="manifest" href="/manifest.json">
          <link rel="icon" sizes="192x192" href="launcher-icon-high-res.png">
          ${styles}
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

    // flush the head with css & js resource tags first so the download starts immediately
    const early = earlyChunk(css, stateJson);
    const chunkNames = [];
    const app = createApp(App, store, chunkNames);

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

    const stream = renderToNodeStream(app).pipe(renderStylesToNodeStream());

    // test for generating html
    // const html = renderStylesToString(renderToStaticMarkup(app));

    stream.pipe(mainStream, {end: false});
    stream.on('end', () => {
        const {js, cssHash} = flushChunks(clientStats, {chunkNames, outputPath});
        const dll = flushDll(clientStats);

        console.log('CHUNK NAMES', chunkNames);

        const late = lateChunk(cssHash, js, dll, raven);
        mainStream.end(late);
    });
};

export default ({clientStats, outputPath}) => (ctx) => {
    ctx.status = 200;
    ctx.type = 'text/html';
    ctx.body = new PassThrough();

    console.log('REQUESTED ORIGINAL PATH:', ctx.originalUrl);

    const url = parse(ctx.originalUrl);

    let path = ctx.originalUrl;
    // check if path is in our whitelist, else give 404 route
    if (!paths.includes(url.pathname) &&
        !ctx.originalUrl.endsWith('.ico') &&
        ctx.originalUrl !== 'service-worker.js' &&
        !(process.env.NODE_ENV === 'development' && ctx.originalUrl.endsWith('.js.map'))) {
        path = '/404';
    }

    console.log('REQUESTED PARSED PATH:', path);

    // DO not use redis cache on dev
    if (process.env.NODE_ENV === 'development') {
        renderStreamed(ctx, path, clientStats, outputPath);
    }
    else {
        cache.exists(path, async (err, reply) => {
            if (reply === 1) {
                console.log('CACHE KEY EXISTS: ', path);
                // handle status 404
                if (path === '/404') {
                    ctx.status = 404;
                }

                cache.get(path, (err, reply) => ctx.body.end(reply));
            }
            else {
                await renderStreamed(ctx, path, clientStats, outputPath);
            }
        });
    }
};
