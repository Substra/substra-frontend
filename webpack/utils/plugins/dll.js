import path from 'path';
import webpack from 'webpack';
import BabelMinifyPlugin from 'babel-minify-webpack-plugin';
import AutoDllPlugin from 'autodll-webpack-plugin';

const DEVELOPMENT = (['development', 'staging'].includes(process.env.NODE_ENV));

export default new AutoDllPlugin({
    inject: true,
    context: path.join(__dirname, '../../..'),
    filename: `[name]${DEVELOPMENT ? '' : '_[hash]'}.dll.js`,
    plugins: !DEVELOPMENT ? [
        new BabelMinifyPlugin({}, {
            comments: false,
            sourceMap: true,
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
    ] : [],
    debug: true,
    entry: {
        reactVendors: [
            'react',
            'react-dom',
            'react-emotion',
            'emotion',
            'react-tap-event-plugin',
        ],
        reduxVendors: [
            'redux',
            'redux-actions',
            'redux-first-router',
            'redux-reducers-injector',
            'redux-saga',
            'redux-sagas-injector',
        ],
        commonVendors: [
            'fastclick',
            'history',
            'react-helmet',
            'recompose',
        ],
    },
});
