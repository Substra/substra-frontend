/**
 * Build config for electron renderer process
 */

import path from 'path';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
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
                        'transform-runtime',
                        'lodash',
                        'date-fns',
                        'transform-class-properties',
                        'transform-es2015-classes',
                    ],
                    presets: [
                        'env',
                        'react',
                        'stage-0',
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
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
        }),
        new ExtractCssChunks('style.css'),
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
            openAnalyzer: process.env.OPEN_ANALYZER === 'true',
        }),
    ],
});
