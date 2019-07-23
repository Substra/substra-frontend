import React, {Fragment} from 'react';
import {hot} from 'react-hot-loader';

import {GlobalStyles} from '@substrafoundation/substra-ui';

import Root from './root';
import store from './store';


const App = () => (
    <Fragment>
        <GlobalStyles />
        <Root store={store} />
    </Fragment>
);

export default hot(module)(App);
