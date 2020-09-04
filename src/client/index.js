/* global document */

import React from 'react';
import {hydrate, render} from 'react-dom';
import FastClick from 'fastclick';

import App from './App';

// load DevTools
import './DevTools';

FastClick.attach(document.body);

const root = document.getElementById('root');

// render for static, hydrate for SSR
if (process.env.IS_STATIC === 'true') {
    render(<App />, root);
}
else {
    hydrate(<App />, root);
}
