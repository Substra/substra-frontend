export default {
    vendor: ['fetch-everywhere'],
    react: ['react', 'react-dom', 'react-tap-event-plugin', 'react-universal-component'], // careful react-redux  and redux-first-router-link can introduce a bug with react-hot-loader
    redux: ['redux', 'redux-actions', 'redux-first-router', 'redux-reducers-injector', 'redux-saga', 'redux-sagas-injector'],
    emotion: ['react-emotion', 'emotion', 'create-emotion', 'create-emotion-styled'],
    common: ['fastclick', 'history', 'lodash', 'react-helmet', 'react-spinners', 'recompose'],
};
