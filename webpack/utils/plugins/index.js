import webpack from 'webpack';
import config from 'config';
import path from 'path';
import glob from 'glob';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import HappyPack from 'happypack';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';


import RavenPlugin from './tools/ravenPlugin';

import definePlugin from './definePlugin';
import dll from './dll';
import pwaManifest from './pwaManifest';

import routes from '../../../src/app/routesMap';

const DEVELOPMENT = (['development', 'staging'].includes(process.env.NODE_ENV)),
    PRODUCTION = (['production'].includes(process.env.NODE_ENV)),
    DEBUG = !(['production', 'development', 'staging'].includes(process.env.NODE_ENV));

export default env => [
    ...(env === 'client' ? [
        pwaManifest,
        new RavenPlugin(config.apps.frontend.raven_url, path.resolve(__dirname, '../../../assets/js/raven.min.js')),
        ...(PRODUCTION || process.env.IS_STATIC === 'true' ? [
            //new webpack.optimize.AggressiveMergingPlugin(),
            new StatsPlugin('stats.json'),
            new SWPrecacheWebpackPlugin({
                cacheId: config.appName,
                filename: 'service-worker.js',
                minify: false,
                dynamicUrlToDependencies: {
                    ...Object.keys(routes).reduce((p, c) => ({
                        ...p,
                        [routes[c].path]: [
                            ...glob.sync(path.resolve(__dirname, '../../../src/app/**/*.{js,png}')),
                            ...glob.sync(path.resolve(__dirname, '../../../src/client/**/*.{js,png}')),
                            ...glob.sync(path.resolve(__dirname, '../../../src/common/**/*.{js,png}')),
                        ],
                    }), {}),
                },
                navigateFallback: '/404', // needed for working offline and avoiding blink on not found pages
                mergeStaticsConfig: true,
                // allow to deactivate service worker caching on search parameter, make search bar initializes correctly with right REDUX_STATE from server
                navigateFallbackWhitelist: [/\?search=/],
                staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/, /index\.html$/, /404\.html$/],
                // https://github.com/GoogleChromeLabs/sw-precache#handlefetch-boolean
                // handleFetch: true, // pass to false for debugging
            }),
        ] : [
            //dll,
            new BrowserSyncPlugin(
                // BrowserSync options
                {
                    // browse to http://localhost:3001/ during development
                    open: false,
                    port: config.apps.frontend.api_port + 1,
                    proxy: {
                        target: `localhost:${config.apps.frontend.api_port}`,
                    },
                    ghostMode: false,
                },
                // plugin options
                {
                    // prevent BrowserSync require(reloading the page
                    // and let Webpack Dev Server take care of this
                    reload: false,
                    callback: () => console.log('Finished proxifying...'),
                },
            ),
        ]),
    ] : [
        // The LimitChunkCountPlugin with maxChunks: 1 insures only one file is generated for your server bundle so it can be run synchronously.
        // https://github.com/faceyspacey/webpack-flush-chunks
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
    ]),
    new WriteFilePlugin(),
    definePlugin(),
    new LodashModuleReplacementPlugin({
        shorthands: true,
    }),
    new HappyPack({
        id: 'babel',
        loaders: [{
            path: 'babel-loader', // Options to configure babel with
            query: {
                // ignore babelrc
                babelrc: false,
                plugins: [
                    ['universal-import', {
                        disableWarnings: true,
                    }],
                    'lodash',
                    '@babel/plugin-transform-runtime',
                    'emotion',
                    // Stage 0
                    '@babel/plugin-proposal-function-bind',

                    // Stage 1
                    '@babel/plugin-proposal-export-default-from',
                    '@babel/plugin-proposal-logical-assignment-operators',
                    ['@babel/plugin-proposal-optional-chaining', {loose: false}],
                    ['@babel/plugin-proposal-pipeline-operator', {proposal: 'minimal'}],
                    ['@babel/plugin-proposal-nullish-coalescing-operator', {loose: false}],
                    '@babel/plugin-proposal-do-expressions',

                    // Stage 2
                    ['@babel/plugin-proposal-decorators', {legacy: true}],
                    '@babel/plugin-proposal-function-sent',
                    '@babel/plugin-proposal-export-namespace-from',
                    '@babel/plugin-proposal-numeric-separator',
                    '@babel/plugin-proposal-throw-expressions',

                    // Stage 3
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-syntax-import-meta',
                    ['@babel/plugin-proposal-class-properties', {loose: true}],
                    '@babel/plugin-proposal-json-strings',
                    ...(PRODUCTION && env === 'client' ? [
                        '@babel/plugin-transform-react-constant-elements',
                        '@babel/plugin-transform-react-inline-elements',
                        'transform-react-remove-prop-types',
                    ] : []),
                    ...(DEVELOPMENT ? ['react-hot-loader/babel'] : []),
                ],
                presets: [
                    // do not transpil es6 import into require, webpack needs to see the import and exports statements to do tree-shaking
                    ['@babel/preset-env', {modules: false}],
                    '@babel/preset-react',
                ],
            },
        }],
        threads: 4,
    }),
    new ExtractCssChunks({
        filename: '[name].css',
        allChunks: false,
    }),
    ...(DEBUG ? [new BundleAnalyzerPlugin({
        analyzerMode: 'static',
    })] : []),
    ...(DEVELOPMENT ? [new webpack.NamedModulesPlugin()] : [new webpack.HashedModuleIdsPlugin()]),
];
