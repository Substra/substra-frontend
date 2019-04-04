import {actionTypes} from './actions';
import search from './business/search/reducers';
import title from './business/routes/reducers/title';

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
    title,
};
