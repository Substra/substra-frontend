import {actionTypes} from '../actions';

const initialState = {
    inputValue: '',
    selectedItem: [],
    isParent: true,

    filters: [],
    item: null,
    toUpdate: false,

    updated: false,
};

export default (state = initialState, {type, payload}) => {
    let filters = [];

    switch (type) {
        case actionTypes.state.SET:

            filters = payload.selectedItem ? payload.selectedItem.reduce((p, c) => (
                [
                    ...p,
                    ...(c.isLogic ? [c.parent] : [`${c.parent}:${c.child}`]),
                ]
            ), []) : state.filters;

            return {
                ...state,
                ...payload,
                updated: true,
                filters,
            };
        case actionTypes.updated.SET:
            return {
                ...state,
                updated: payload,
            };
        default:
            return state;
    }
};
