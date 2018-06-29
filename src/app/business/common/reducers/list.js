const initialState = {
    init: false,
    loading: false,
    error: null,
    results: [],
    selected: [],
};

export default actionTypes => (state = initialState, {type, payload}) => {
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
                init: true,
                results: payload,
                error: false,
                loading: false,
            };

        case actionTypes.list.FAILURE:
            return {
                ...state,
                init: true,
                error: payload,
                loading: false,
            };
        case actionTypes.list.SELECTED:
            return {
                ...state,
                selected: payload,
            };
        default:
            return state;
    }
};
