import path from 'path';
import {redirect} from 'redux-first-router';
import {endsWith} from 'lodash';
import queryString from 'query-string';

import routes from '../../app/routesMap';

export default {
    onBeforeChange: (dispatch, getState, action) => {
        const {location} = getState();

        // for handling electron
        if (!Object.keys(routes).includes(action.type) &&
            (endsWith(location.pathname, path.join(__dirname, '../electron/app.html')) ||
                endsWith(location.prev.pathname, path.join(__dirname, '../electron/app.html')))) {
            dispatch(redirect({type: 'HOME'}));
        }
    },
    querySerializer: queryString,
};
