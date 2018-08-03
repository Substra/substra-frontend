import {actionTypes} from '../actions';

const initialState = {
    filters: {},
    item: null,
};

export default (state = initialState, {type, payload}) => {
    switch (type) {
        case actionTypes.filters.SET:
            return {
                ...state,
                filters: payload.reduce((p, c) => (
                    [
                        ...p,
                        ...(c.isLogic ? [c.parent] : [`${c.parent}:${c.child}`]),
                    ]
                ), []),
            };
        case actionTypes.item.SET:
            return {
                ...state,
                item: payload,
            };
        default:
            return state;
    }
};
