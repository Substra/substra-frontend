import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import {spawn} from 'child_process';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import HappyPack from 'happypack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import config from 'config';

import baseConfig from './base';
import rules from '../utils/rules';
import definePlugin from '../utils/plugins/definePlugin';
// import dll from '../utils/plugins/dll';


const port = process.env.PORT || 1212;
const publicPath = `http://electron.owkin.xyz:${port}/`;

export default merge.smart(baseConfig, {
    devtool: 'inline-source-map',

    target: 'electron-renderer',

    entry: [
        '@babel/polyfill',
        `webpack-dev-server/client?${publicPath}/`,
        'webpack/hot/only-dev-server',
        path.join(__dirname, '../../src/client/index.js'),
    ],

    output: {
        publicPath,
    },

    module: {
        rules: rules(),
    },

    plugins: [
        definePlugin(),
        new HappyPack({
            id: 'babel',
            loaders: [{
                path: 'babel-loader', // Options to configure babel with
                query: {
                    babelrc: false,
                    cacheDirectory: true,
                    plugins: [
                        ['universal-import', {
                            disableWarnings: true,
                        }],
                        'emotion',
                        '@babel/plugin-transform-runtime',
                        'lodash',
                        'react-hot-loader/babel',

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
                    ],
                    presets: [
                        ['@babel/preset-env', {modules: false}],
                        '@babel/preset-react',
                    ],
                },
            }],
            threads: 4,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/electron/app.ejs',
            title: `${config.appName} dev`,
            inject: true,
        }),
        // dll,
        new ExtractCssChunks({
            filename: '[name].css',
            allChunks: false,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
    ],

    node: {
        __dirname: false,
        __filename: false,
    },

    devServer: {
        port,
        publicPath,
        compress: true,
        disableHostCheck: true,
        noInfo: true,
        stats: 'errors-only',
        inline: true,
        lazy: false,
        hot: true,
        headers: {'Access-Control-Allow-Origin': '*'},
        contentBase: path.join(__dirname, '../../dist'),
        watchOptions: {
            aggregateTimeout: 300,
            ignored: /node_modules/,
            poll: 100,
        },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false,
        },
        before() {
            if (process.env.START_HOT) {
                console.log('Starting Main Process...');
                spawn(
                    'npm',
                    ['run', 'start-main-dev'],
                    {shell: true, env: process.env, stdio: 'inherit'},
                )
                    .on('close', (code) => process.exit(code))
                    .on('error', (spawnError) => console.error(spawnError));
            }
        },
    },
});
