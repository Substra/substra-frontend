/* globals window */

import cookie from 'cookie-parse';
import atob from 'atob';
import isBefore from 'date-fns/isBefore';

import {actionTypes} from './actions';

export default function () {
    const now = new Date();
    let payload = {
        exp: now,
    };
    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            const headerPayload = cookies['header.payload'];
            try {
                payload = JSON.parse(atob(headerPayload.split('.')[1]));
            }
            catch (e) {
                payload = {
                    exp: now,
                };
            }
        }
    }


    const initialState = {
        payload,
        authenticated: isBefore(new Date(payload.exp), now),
        loading: false,
        modal: false,
        registered: false,
    };

    return (state = initialState, {type, payload}) => {
        switch (type) {
        case actionTypes.signIn.REQUEST:
            return {
                ...state,
                authenticated: false,
                payload: null,
                error: false,
                loading: true,
            };
        case actionTypes.signIn.SUCCESS:
            return {
                ...state,
                ...payload,
                authenticated: true,
                registered: true,
                error: false,
                loading: false,
            };

        case actionTypes.signIn.FAILURE:
            return {
                ...state,
                authenticated: false,
                error: payload,
                loading: false,
                payload: null,
                registered: false,
            };

        case actionTypes.signOut.SUCCESS:
            return {
                ...state,
                authenticated: false,
                has_permission: false,
                payload: null,
                loading: false,
            };
        case actionTypes.modal.SET:
            return {
                ...state,
                modal: payload,
            };
        default:
            return state;
        }
    };
}
