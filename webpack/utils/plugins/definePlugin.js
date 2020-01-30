import webpack from 'webpack';
import config from 'config';

const IS_ELECTRON = JSON.stringify(process.env.IS_ELECTRON || 'false');

export default () => new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.DEBUG_PROD': JSON.stringify(process.env.DEBUG_PROD || 'false'),
    'process.env.IS_ELECTRON': IS_ELECTRON,
    'process.env.IS_STATIC': JSON.stringify(process.env.IS_STATIC || 'false'),
    APP_NAME: JSON.stringify(config.appName),
    META_DESCRIPTION: JSON.stringify(config.apps.frontend.meta.description),
    PRODUCTION_BASE_NAME: JSON.stringify(config.apps.frontend.baseName.production),
    DEBUG_BASE_NAME: JSON.stringify(config.apps.frontend.baseName.debug),
    SCORE_PRECISION: JSON.stringify(config.apps.frontend.scorePrecision),
    ...(IS_ELECTRON !== 'false' ? {
        API_URL: JSON.stringify(config.apps.frontend.apiUrl), // needed for electron
    } : {}),
});
