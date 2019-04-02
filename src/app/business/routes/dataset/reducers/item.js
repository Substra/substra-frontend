const initialState = {
    init: false,
    loading: false,
    descLoading: false,
    openerLoading: false,
    tabIndex: 0,
    error: null,
    results: [],
};

export default actionTypes => (state = initialState, {type, payload}) => {
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
            };
        case actionTypes.item.description.FAILURE:
            return {
                ...state,
                descLoading: false,
            };

        case actionTypes.item.opener.REQUEST:
            return {
                ...state,
                openerLoading: true,
            };
        case actionTypes.item.opener.SUCCESS:
            return {
                ...state,
                results: state.results.reduce((p, c) => [
                    ...p,
                    ...(c.pkhash === payload.id ? [{
                        ...c,
                        opener: {
                            ...c.opener,
                            content: payload.openerContent,
                        },
                    }] : [c]),
                ], []),
                openerLoading: false,
            };
        case actionTypes.item.opener.FAILURE:
            return {
                ...state,
                openerLoading: false,
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
