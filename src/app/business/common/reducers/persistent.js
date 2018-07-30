const initialState = {
    init: false,
    loading: false,
    error: null,
    results: [],
};

export default actionTypes => (state = initialState, {type, payload}) => {
    switch (type) {
        case actionTypes.persistent.REQUEST:
            return {
                ...state,
                error: false,
                loading: true,
            };

        case actionTypes.persistent.SUCCESS:
            return {
                ...state,
                init: true,
                results: payload,
                error: false,
                loading: false,
            };

        case actionTypes.persistent.FAILURE:
            return {
                ...state,
                init: true,
                error: payload,
                loading: false,
            };
        default:
            return state;
    }
};
