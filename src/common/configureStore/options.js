import {redirect} from 'redux-first-router';
import queryString from 'query-string';

export default {
    onAfterChange: (dispatch, getState) => {
        const {user, location} = getState();

        if (location.type === 'LOGIN' && user && user.authenticated) {
            dispatch(redirect({type: 'HOME'}));
        }
        else if (location.type !== 'LOGIN' && user && !user.authenticated) {
            dispatch(redirect({type: 'LOGIN'}));
        }
    },
    querySerializer: queryString,
};
