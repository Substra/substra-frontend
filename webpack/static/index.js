import config from 'config';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import serviceWorker from '../../src/server/serviceWorker';

import rules from '../utils/rules';
import resolve from '../utils/resolve';
import plugins from '../utils/plugins/index';

const DEBUG = !(['production', 'development', 'staging'].includes(process.env.NODE_ENV)),
    DEVELOPMENT = (['development', 'staging'].includes(process.env.NODE_ENV)),
    PRODUCTION = (['production'].includes(process.env.NODE_ENV)),
    // override production config
    PRODUCTION_BASE_NAME = '/static/',
    DEBUG_BASE_NAME = '/SubstraFoundation.github.io/static/';

export default {
    name: 'client',
    target: 'web',
    devtool: DEBUG ? 'source-map' : (DEVELOPMENT ? 'cheap-module-source-map' : '#hidden-source-map'),
    entry: {
        vendor: [
            '@babel/polyfill',
            'fetch-everywhere',
        ],
        main: [
            path.resolve(__dirname, '../../src/client/index.js'),
        ],
    },
    module: {
        rules: rules(),
    },
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
    output: {
        filename: `[name]${PRODUCTION ? '-[hash:6]' : ''}.js`,
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, '../../static'),
        publicPath: DEBUG ? DEBUG_BASE_NAME : PRODUCTION_BASE_NAME,
    },
    plugins: [
        ...plugins('client'),
        ...[
            new HtmlWebpackPlugin({
                title: config.appName,
                META_DESCRIPTION: config.apps.frontend.meta.description,
                serviceWorker,
                filename: path.resolve(__dirname, '../../index.html'),
                template: path.resolve(__dirname, '../static/index.html'),
                publicPath: DEBUG ? DEBUG_BASE_NAME : PRODUCTION_BASE_NAME,
            }),
            new HtmlWebpackPlugin({
                title: config.appName,
                META_DESCRIPTION: config.apps.frontend.meta.description,
                serviceWorker,
                filename: path.resolve(__dirname, '../../404.html'),
                template: path.resolve(__dirname, '../static/index.html'),
                publicPath: DEBUG ? DEBUG_BASE_NAME : PRODUCTION_BASE_NAME,
            }),
        ],
    ],
    resolve: resolve(),
};
