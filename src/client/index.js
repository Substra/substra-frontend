/* global document */

import React from 'react';
import {hydrate, render} from 'react-dom';
import FastClick from 'fastclick';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './App';

// load DevTools
import './DevTools';


FastClick.attach(document.body);
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const root = document.getElementById('root');

// render for electron and static, hydrate for SSR
if (process.env.IS_ELECTRON !== 'false' || process.env.IS_STATIC === 'true') {
    render(<App />, root);
}
else {
    hydrate(<App />, root);
}
