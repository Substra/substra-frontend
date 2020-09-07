import baseReducerBuilder, {initialState as baseInitialState} from '../../../common/reducers/item';

const initialState = {
    ...baseInitialState,
    openerLoading: false,
    openerForbidden: false,
};

export default (actionTypes) => {
    const baseReducer = baseReducerBuilder(actionTypes);
    return (state = initialState, {type, payload}) => {
        const reducedState = baseReducer(state, {type, payload});

        // know if item exists
        const exists = payload && state.results.find((x) => x.key === payload.key);

        switch (type) {
            // override for updating if necessary
            case actionTypes.item.SUCCESS:
                return {
                    ...state,
                    init: true,
                    results: !exists ? [...state.results, payload] : state.results.reduce((p, c) => [
                        ...p,
                        ...(c.key === payload.key ? [{
                            ...c,
                            ...payload,
                            opener: {
                                ...c.opener,
                                ...payload.opener,
                            },
                            description: {
                                ...c.description,
                                ...payload.description,
                            },
                        }] : [c]),
                    ], []),
                    error: false,
                    loading: false,
                };
            case actionTypes.item.description.SUCCESS:
                return {
                    ...state,
                    results: !exists ? [...state.results, {
                        key: payload.key,
                        description: {content: payload.desc},
                    }] : state.results.reduce((p, c) => [
                        ...p,
                        ...(c.key === payload.key ? [{
                            ...c,
                            description: {
                                ...c.description,
                                content: payload.desc,
                            },
                        }] : [c]),
                    ], []),
                    descLoading: false,
                };
            case actionTypes.item.opener.REQUEST:
                return {
                    ...state,
                    openerLoading: true,
                    openerForbidden: false,
                };
            case actionTypes.item.opener.SUCCESS:
                return {
                    ...state,
                    results: !exists ? [...state.results, {
                        key: payload.key,
                        opener: {content: payload.openerContent},
                    }] : state.results.reduce((p, c) => [
                        ...p,
                        ...(c.key === payload.key ? [{
                            ...c,
                            opener: {
                                ...c.opener,
                                content: payload.openerContent,
                            },
                        }] : [c]),
                    ], []),
                    openerLoading: false,
                    openerForbidden: false,
                };
            case actionTypes.item.opener.FAILURE:
                return {
                    ...state,
                    openerLoading: false,
                    openerForbidden: payload.status === 403,
                };
            default:
                return reducedState;
        }
    };
};
