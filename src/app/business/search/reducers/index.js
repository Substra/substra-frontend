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
                    {
                        ...p,
                        [c.parent]: [
                            ...p[c.parent] || {}, // add precedent parent or init
                            ...(p[c.parent] ? (p[c.parent].includes(c.child) ? [] : [c.child]) : [c.child]), // add child if not present
                        ],
                    }
                ), {}),
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
