import {actionTypes} from '../actions';

const initialState = {
    inputValue: '',
    selectedItem: [],
    isParent: true,

    filters: {},
    item: null,
    toUpdate: false,

    isComplex: false,
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
                filters,
            };
        case actionTypes.isComplex.SET:
            return {
                ...state,
                isComplex: payload,
            };
        default:
            return state;
    }
};
