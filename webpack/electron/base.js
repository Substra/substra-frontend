/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';

export default {
    mode: process.env.NODE_ENV,
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                },
            },
        }],
    },
    output: {
        path: path.join(__dirname, '../../src'),
        filename: 'renderer.dev.js',
        // https://github.com/webpack/webpack/issues/1114
        libraryTarget: 'commonjs2',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [
            path.join(__dirname, '../../src'),
            'node_modules',
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        }),

        new webpack.NamedModulesPlugin(),
    ],
};
