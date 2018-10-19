import {redirect} from 'redux-first-router';
import queryString from 'query-string';
import {endsWith} from 'lodash';

export default {
    onAfterChange: (dispatch, getState) => {
        const {location} = getState();

        // for handling electron
        if (endsWith(location.pathname, '/dist/index.html')) {
            dispatch(redirect({type: 'HOME'}));
        }
    },
    querySerializer: queryString,
};
