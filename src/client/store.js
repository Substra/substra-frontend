/* global window */

import configureStore from '../common/configureStore';
import history from './root/history';

export default configureStore(history, window.REDUX_STATE).store;
