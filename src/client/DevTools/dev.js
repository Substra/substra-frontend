/* globals document */

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import DevTools from '../../common/DevTools';
import store from '../store';

const devTools = document.getElementById('devTools');

// load devTools
render(<Provider store={store}>
    <DevTools />
</Provider>, devTools);
