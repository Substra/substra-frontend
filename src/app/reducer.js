import {reducer as formReducer} from 'redux-form';

import {actionTypes} from './actions';
import search from './business/search/reducers';
import title from './business/routes/reducers/title';
import userReducerFactory from '../app/business/user/reducer';

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
    form: formReducer,
    user: userReducerFactory(),
    general,
    search,
    title,
};
