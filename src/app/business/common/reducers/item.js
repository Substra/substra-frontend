export const initialState = {
    init: false,
    loading: false,
    descLoading: false,
    descForbidden: false,
    error: null,
    results: [],
    tabIndex: 0,
};

export default (actionTypes) => (state = initialState, {type, payload}) => {
    switch (type) {
        case actionTypes.item.REQUEST:
            return {
                ...state,
                error: false,
                loading: true,
            };

        case actionTypes.item.SUCCESS:
            return {
                ...state,
                init: true,
                results: [...state.results, payload],
                error: false,
                loading: false,
            };

        case actionTypes.item.FAILURE:
            return {
                ...state,
                init: true,
                error: payload,
                loading: false,
            };
        case actionTypes.item.description.REQUEST:
            return {
                ...state,
                descLoading: true,
                descForbidden: false,
            };
        case actionTypes.item.description.SUCCESS:
            return {
                ...state,
                init: true,
                results: state.results.reduce((p, c) => [
                    ...p,
                    ...(c.pkhash === payload.id ? [{...c, description: {...c.description, content: payload.desc}}] : [c]),
                ], []),
                descLoading: false,
                descForbidden: false,
            };
        case actionTypes.item.description.FAILURE:
            return {
                ...state,
                descLoading: false,
                descForbidden: payload.status === 403,
            };
        case actionTypes.item.tabIndex.SET:
            return {
                ...state,
                tabIndex: payload,
            };
        default:
            return state;
    }
};
