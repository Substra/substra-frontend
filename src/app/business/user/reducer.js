import {actionTypes} from './actions';

export default function (localStorage) {
    const initialState = {
        payload: localStorage ? localStorage.getItem('payload') : '',
        // exp: localStorage.getItem('exp') ? parseInt(localStorage.getItem('exp'), 10) : localStorage.getItem('exp'),
        authenticated: localStorage ? !!localStorage.getItem('payload') : false,
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
                // exp: null,
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
                // exp: null,
                registered: false,
            };

        case actionTypes.signOut.SUCCESS:
            return {
                ...state,
                authenticated: false,
                has_permission: false,
                payload: null,
                loading: false,
                // exp: null,
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
