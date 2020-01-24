import baseReducerBuilder, {initialState as baseInitialState} from '../../../common/reducers/item';

const initialState = {
    ...baseInitialState,
    openerLoading: false,
};

export default (actionTypes) => {
    const baseReducer = baseReducerBuilder(actionTypes);
    return (state = initialState, {type, payload}) => {
        const reducedState = baseReducer(state, {type, payload});

        // know if item exists
        const exists = payload && state.results.find((x) => x.pkhash === payload.pkhash);

        switch (type) {
            // override for updating if necessary
            case actionTypes.item.SUCCESS:
                return {
                    ...state,
                    init: true,
                    results: !exists ? [...state.results, payload] : state.results.reduce((p, c) => [
                        ...p,
                        ...(c.pkhash === payload.pkhash ? [{
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
                        pkhash: payload.pkhash,
                        description: {content: payload.desc},
                    }] : state.results.reduce((p, c) => [
                        ...p,
                        ...(c.pkhash === payload.pkhash ? [{
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
                };
            case actionTypes.item.opener.SUCCESS:
                return {
                    ...state,
                    results: !exists ? [...state.results, {
                        pkhash: payload.pkhash,
                        opener: {content: payload.openerContent},
                    }] : state.results.reduce((p, c) => [
                        ...p,
                        ...(c.pkhash === payload.pkhash ? [{
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
            default:
                return reducedState;
        }
    };
};
