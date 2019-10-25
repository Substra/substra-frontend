import webpack from 'webpack';
import config from 'config';

export default () => new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.DEBUG_PROD': JSON.stringify(process.env.DEBUG_PROD || 'false'),
    'process.env.IS_ELECTRON': JSON.stringify(process.env.IS_ELECTRON || 'false'),
    'process.env.IS_STATIC': JSON.stringify(process.env.IS_STATIC || 'false'),
    APP_NAME: JSON.stringify(config.appName),
    META_DESCRIPTION: JSON.stringify(config.apps.frontend.meta.description),
    PRODUCTION_BASE_NAME: JSON.stringify(config.apps.frontend.baseName.production),
    DEBUG_BASE_NAME: JSON.stringify(config.apps.frontend.baseName.debug),
    SUBSTRABACKEND_AUTH_ENABLED: JSON.stringify(config.credentials.enabled),
    GOOGLE_ANALYTICS_TRACKER_ID: JSON.stringify(config.googleAnalytics.trackerID),
    SCORE_PRECISION: JSON.stringify(config.apps.frontend.scorePrecision),
});
