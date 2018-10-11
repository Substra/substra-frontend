/**
 * Build config for electron renderer process
 */

import path from 'path';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import HappyPack from 'happypack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import config from 'config';

import baseConfig from './base';
import rules from '../utils/rules';
import definePlugin from '../utils/plugins/definePlugin';


export default merge.smart(baseConfig, {
    devtool: 'source-map',
    target: 'electron-renderer',
    entry: './src/client/index',
    output: {
        path: path.join(__dirname, '../../build/electron/dist'),
        publicPath: './',
        filename: 'renderer.prod.js',
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
                    plugins: [
                        ['universal-import', {
                            disableWarnings: true,
                        }],
                        'emotion',
                        '@babel/plugin-transform-runtime',
                        'lodash',

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
            title: `${config.appName}`,
            inject: true,
        }),
        new ExtractCssChunks('style.css'),
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
            openAnalyzer: process.env.OPEN_ANALYZER === 'true',
        }),
    ],
    optimization: {
        minimizer: [new TerserPlugin({
            cache: true,
            parallel: true,
        })],
    },
});
