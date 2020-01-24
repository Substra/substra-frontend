import React from 'react';
import {hot} from 'react-hot-loader';

import {GlobalStyles} from '@substrafoundation/substra-ui';

import Root from './root';
import store from './store';


const App = () => (
    <>
        <GlobalStyles />
        <Root store={store} />
    </>
);

export default hot(module)(App);
