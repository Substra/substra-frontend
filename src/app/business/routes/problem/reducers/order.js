import {actionTypes} from '../actions';

const initialState = {
    by: '',
    direction: 'asc'
};

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case actionTypes.order.SET:
            return {
                ...state,
                ...payload
            };
        default:
            return state;
    }
};
