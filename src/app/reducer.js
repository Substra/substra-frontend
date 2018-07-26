import {actionTypes} from './actions';
import search from './business/search/reducers';

const initialState = {
    error: '',
};

export const general = (state = initialState, {type, payload}) => {
    switch (type) {
    case actionTypes.error.SET:
        return {
            ...state,
            error: payload,
        };
    default:
        return state;
    }
};

export default {
    general,
    search,
};
