import React from 'react';
import {hot} from 'react-hot-loader';

import Root from './root';
import store from './store';

// load main css
import '../../assets/css/index.scss';

const App = () => <Root store={store} />;

export default hot(module)(App);
