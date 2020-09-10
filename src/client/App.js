import React from 'react';
import {hot} from 'react-hot-loader';

import Root from './root';
import store from './store';
import GlobalStyles from '../app/common/components/globalStyles';


const App = () => (
    <>
        <GlobalStyles />
        <Root store={store} />
    </>
);

export default hot(module)(App);
