/* globals window */

import cookie from 'cookie-parse';
import atob from 'atob';
import isBefore from 'date-fns/isBefore';

import {actionTypes} from './actions';

export default function () {
    const now = new Date();
    let exp = null;
    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            const headerPayload = cookies['header.payload'];
            try {
                exp = JSON.parse(atob(headerPayload.split('.')[1]));
            }
            catch (e) {
                exp = null;
            }
        }
    }

    const initialState = {
        authenticated: isBefore(new Date(exp), now),
        error: false,
        loading: false,
        exp,
        payload: null,
    };

    return (state = initialState, {type, payload}) => {
        switch (type) {
            case actionTypes.signIn.REQUEST:
            return {
                ...state,
                authenticated: false,
                error: false,
                loading: true,
                exp: null,
                payload: null,
            };
        case actionTypes.signIn.SUCCESS:
            return {
                ...state,
                authenticated: true,
                error: false,
                loading: false,
                exp: new Date(payload.exp * 1000),
                payload,
            };
        case actionTypes.signIn.FAILURE:
            return {
                ...state,
                authenticated: false,
                error: payload,
                loading: false,
                exp: null,
                payload: null,
            };
        case actionTypes.signOut.SUCCESS:
            return {
                ...state,
                authenticated: false,
                error: null,
                loading: false,
                payload: null,
                exp: null,
            };
        default:
            return state;
        }
    };
}
