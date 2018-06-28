import fs from 'fs';
import path from 'path';
import config from 'config';

import http from 'http';
import http2 from 'http2';
import webpack from 'webpack';

import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import cookie from 'koa-cookie';
import compress from 'koa-compress';
import helmet from 'koa-helmet';

import hotClient from 'webpack-hot-client';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';

// Must be imported in that way to be include in prod
import clientConfig from '../../webpack/ssr/client';
import serverConfig from '../../webpack/ssr/server';


const DEBUG = !(['production', 'development', 'staging'].includes(process.env.NODE_ENV));
const DEVELOPMENT = (['development', 'staging'].includes(process.env.NODE_ENV));


// Redefined publicPath and outputPath instead of import clientConfig to solve
// prod importation problems
const publicPath = DEBUG ? config.apps.frontend.baseName.debug : config.apps.frontend.baseName.production;
const outputPath = path.resolve(__dirname, '../../build/ssr/client');

const app = new Koa();
app.use(helmet());
app.use(cookie());
app.use(compress());


// let's encrypt config
const resolve = p => path.resolve(__dirname, p);
app.use(mount('/.well-known', serve(resolve('../../.well-known'))));

// UNIVERSAL HMR + STATS HANDLING GOODNESS:
if (DEVELOPMENT) {
    const multiCompiler = webpack([clientConfig, serverConfig]);
    const clientCompiler = multiCompiler.compilers[0];

    // First we fire up Webpack an pass in the configuration we
    // created
    let bundleStart = null;
    // We give notice in the terminal when it starts bundling and
    // set the time it started
    clientCompiler.plugin('compile', () => {
        console.log('Bundling...');
        bundleStart = Date.now();
    });
    // We also give notice when it is done compiling, including the
    // time it took. Nice to have
    clientCompiler.plugin('done', () => {
        console.log(`Bundled in ${(Date.now() - bundleStart)}ms!`);
    });

    // support hot module with websocket, not event-stream
    hotClient(clientCompiler, true);
    app.use(webpackDevMiddleware(multiCompiler, {
        publicPath,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
        },
        quiet: false,
        noInfo: false,
        stats: {
            colors: true,
            reasons: DEBUG,
            hash: DEVELOPMENT,
            version: DEVELOPMENT,
            timings: true,
            chunks: DEVELOPMENT,
            chunkModules: DEVELOPMENT,
            cached: DEVELOPMENT,
            cachedAssets: DEVELOPMENT,
        },
        headers: clientConfig.devServer.headers,
    }));

    // keeps serverRender updated with arg: { clientStats, outputPath }
    app.use(webpackHotServerMiddleware(multiCompiler, {
        serverRendererOptions: {outputPath},
        createHandler: webpackHotServerMiddleware.createKoaHandler,
    }));


    // uncomment this code block for debugging service worker behaviour in development
    // / https://github.com/goldhand/sw-precache-webpack-plugin#webpack-dev-server-support
    // do not forget to regenerate service-worker.js when modifying SWPrecacheWebpackPlugin config
    // with this command:
    // NODE_ENV=development ./node_modules/.bin/babel-node ./node_modules/webpack/bin/webpack --progress --config webpack/ssr/server.js
    // app.get('/service-worker.js', function (req, res) {
    //     res.set({ 'Content-Type': 'application/javascript; charset=utf-8' });
    //     res.send(fs.readFileSync('./assets/service-worker.js'));
    // });

    http.createServer(app.callback()).listen(config.apps.frontend.api_port, () =>
        console.log(`Listening @ http://localhost:${config.apps.frontend.api_port}/`),
    );
}
else {
    const clientStats = require('../../build/ssr/client/stats.json'); // eslint-disable-line import/no-unresolved
    const serverRender = require('../../build/ssr/server/main.js').default; // eslint-disable-line import/no-unresolved

    app.use(mount(publicPath, serve(outputPath)));
    app.use(serverRender({clientStats, outputPath}));

    // self signed
    // const key = fs.readFileSync('./encryption/ca.key');
    // const cert = fs.readFileSync( './encryption/ca.crt' );
    // const ca = fs.readFileSync( './encryption/ia.crt' );
    // const options = {
    //     key,
    //     cert,
    //     ca,
    // };

    // let's encrypted generated files
    const key = fs.readFileSync(path.resolve(config.encryption.privkey));
    const cert = fs.readFileSync(path.resolve(config.encryption.fullchain));

    const options = {
        key,
        cert,
        allowHTTP1: true,
    };

    http.createServer(function (req, res) {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(config.apps.frontend.api_port);

    http2.createSecureServer(options, app.callback()).listen(config.apps.frontend.secure_api_port, () =>
        console.log(`Listening @ https://localhost:${config.apps.frontend.secure_api_port}/`),
    );
}
