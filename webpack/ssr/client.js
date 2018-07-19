import config from 'config';
import path from 'path';
import rules from '../utils/rules';
import resolve from '../utils/resolve';
import plugins from '../utils/plugins';
import vendors from './vendors';

const DEBUG = !(['production', 'development', 'staging'].includes(process.env.NODE_ENV)),
    DEVELOPMENT = (['development', 'staging'].includes(process.env.NODE_ENV)),
    PRODUCTION = (['production'].includes(process.env.NODE_ENV)),
    PRODUCTION_BASE_NAME = config.apps.frontend.baseName.production,
    DEBUG_BASE_NAME = config.apps.frontend.baseName.debug;

const modulesRegex = new RegExp(`node_modules\\/(?!(${Object.keys(vendors).reduce((p, c) => [
    ...p,
    ...vendors[c],
], []).join('|')})\\/).*`);

export default {
    mode: process.env.NODE_ENV,
    name: 'client',
    target: 'web',
    devtool: DEBUG ? 'source-map' : (DEVELOPMENT ? 'cheap-module-source-map' : '#hidden-source-map'),
    entry: {
        main: [
            'fetch-everywhere',
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
        chunkFilename: `[name]${PRODUCTION ? '-[chunkhash:6]' : ''}.js`,
        path: path.resolve(__dirname, '../../build/ssr/client'),
        publicPath: DEBUG ? DEBUG_BASE_NAME : PRODUCTION_BASE_NAME,
    },
    plugins: plugins('client'),
    resolve: resolve(),
    ...(DEVELOPMENT ? {
        devServer: {
            historyApiFallback: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,PATCH',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization',
            },
        },
        watch: true,
        cache: true,
    } : {}),
    // do not use auto dll for production
    ...(PRODUCTION ? {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    // create vendors
                    ...(Object.keys(vendors).reduce((p, c) => {
                        const regex = new RegExp(vendors[c].join('|'));
                        return {
                            ...p,
                            [c]: {
                                test(module, chunks) {
                                    if (!module.nameForCondition) return;
                                    return regex.test(module.nameForCondition());
                                },
                                name: c,
                                chunks: 'initial',
                                enforce: true,
                            },
                        };
                    }, {})),
                    // add missing node_modules
                    modules: {
                        test(module, chunks) {
                            if (!module.nameForCondition) return;
                            return modulesRegex.test(module.nameForCondition());
                        },
                        name: 'modules',
                        chunks: 'initial',
                        enforce: true,
                    },
                },
            },
            runtimeChunk: {
                name: 'bootstrap',
            },
        },
    } : {}),
};
