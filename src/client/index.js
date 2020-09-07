/* global document */

import React from 'react';
import {hydrate} from 'react-dom';
import FastClick from 'fastclick';

import App from './App';

// load DevTools
import './DevTools';

FastClick.attach(document.body);

const root = document.getElementById('root');

hydrate(<App />, root);
