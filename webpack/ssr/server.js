import config from 'config';
import path from 'path';
import fs from 'fs';
import rules from '../utils/rules';
import resolve from '../utils/resolve';
import plugins from '../utils/plugins/index';

const DEBUG = !(['production', 'development', 'staging'].includes(process.env.NODE_ENV)),
    DEVELOPMENT = (['development', 'staging'].includes(process.env.NODE_ENV)),
    PRODUCTION_BASE_NAME = config.apps.frontend.baseName.production,
    DEBUG_BASE_NAME = config.apps.frontend.baseName.debug;

const res = p => path.resolve(__dirname, p);

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:
const externals = fs
    .readdirSync(res('../../node_modules'))
    .filter(x => !/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/.test(x))
    .reduce((ext, mod) => ({
        ...ext,
        [mod]: `commonjs ${mod}`,
    }));

export default {
    mode: process.env.NODE_ENV,
    name: 'server',
    target: 'node',
    devtool: DEBUG
        ? 'source-map'
        : (DEVELOPMENT ? 'cheap-module-source-map' : '#hidden-source-map'),
    entry: [
        'babel-polyfill',
        'fetch-everywhere',
        res('../../src/server/render.js'),
    ],
    module: {
        rules: rules(),
    },
    externals,
    output: {
        path: res('../../build/ssr/server'),
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        publicPath: DEBUG ? DEBUG_BASE_NAME : PRODUCTION_BASE_NAME,
    },
    resolve: resolve(),
    plugins: plugins('server'),
};
