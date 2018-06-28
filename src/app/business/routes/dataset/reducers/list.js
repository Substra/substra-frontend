import {actionTypes} from '../actions';

const initialState = {
    loading: false,
    error: null,
    results: [],
};

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case actionTypes.list.REQUEST:
            return {
                ...state,
                error: false,
                loading: true,
            };

        case actionTypes.list.SUCCESS:
            return {
                ...state,
                results: payload,
                error: false,
                loading: false,
            };

        case actionTypes.list.FAILURE:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        default:
            return state;
    }
};
