/* global document */

import React from 'react';
import {hydrate, render} from 'react-dom';
import FastClick from 'fastclick';

import App from './App';
import {initializeAnalytics} from '../app/analytics';

// load DevTools
import './DevTools';

// Remove the server-side injected CSS.
const jssStyles = document.getElementById('jss-server-side');
if (jssStyles && jssStyles.parentNode) {
    jssStyles.parentNode.removeChild(jssStyles);
}

FastClick.attach(document.body);

const root = document.getElementById('root');

initializeAnalytics();

// render for electron and static, hydrate for SSR
if (process.env.IS_ELECTRON !== 'false' || process.env.IS_STATIC === 'true') {
    render(<App />, root);
}
else {
    hydrate(<App />, root);
}
