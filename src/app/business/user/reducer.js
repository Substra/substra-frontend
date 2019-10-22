/* globals window */

import cookie from 'cookie-parse';
import atob from 'atob';
import isBefore from 'date-fns/isBefore';

import {actionTypes} from './actions';

export default function () {
    const now = new Date();
    let exp = now;
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

    const authenticated = isBefore(new Date(exp), now);

    const initialState = {
        authenticated,
        error: false,
        loading: false,
        refreshLoading: false,
        init: authenticated,
        exp,
        payload: null,
    };

    return (state = initialState, {type, payload}) => {
        switch (type) {
        case actionTypes.signIn.REQUEST:
            return {
                ...state,
                authenticated: false,
                loading: true,
            };
        case actionTypes.signIn.SUCCESS:
            return {
                ...state,
                authenticated: true,
                init: true,
                error: false,
                loading: false,
                exp: new Date(payload.exp * 1000),
                payload,
            };
        case actionTypes.signIn.FAILURE:
            return {
                ...state,
                authenticated: false,
                init: true,
                error: payload,
                loading: false,
                exp: new Date(),
                payload: null,
            };
        case actionTypes.refresh.REQUEST:
            return {
                ...state,
                authenticated: false,
                refreshLoading: true,
            };
        case actionTypes.refresh.SUCCESS:
            return {
                ...state,
                authenticated: true,
                init: true,
                error: false,
                refreshLoading: false,
                exp: new Date(payload.exp * 1000),
                payload,
            };
        case actionTypes.refresh.FAILURE:
            return {
                ...state,
                authenticated: false,
                init: true,
                error: payload,
                refreshLoading: false,
                exp: new Date(),
                payload: null,
            };
        case actionTypes.signOut.SUCCESS:
            return {
                ...state,
                authenticated: false,
                error: null,
                payload: null,
                exp: new Date(),
            };
        default:
            return state;
        }
    };
}
