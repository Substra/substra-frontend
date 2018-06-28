/* globals PRODUCTION_BASE_NAME */

import {createBrowserHistory} from 'history';

export const history = createBrowserHistory({
    basename: PRODUCTION_BASE_NAME,
});

export default history;
