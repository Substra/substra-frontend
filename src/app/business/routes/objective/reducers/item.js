import baseReducerBuilder, {initialState as baseInitialState} from '../../../common/reducers/item';

const initialState = {
    ...baseInitialState,
    metricsLoading: false,
};

export default (actionTypes) => {
    const baseReducer = baseReducerBuilder(actionTypes);
    return (state = initialState, {type, payload}) => {
       const reducedState = baseReducer(state, {type, payload});

        // know if item exists
        const exists = payload && state.results.find(x => x.pkhash === payload.pkhash);

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
                            metrics: {
                                ...c.metrics,
                                ...payload.metrics,
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
            case actionTypes.item.metrics.REQUEST:
                return {
                    ...reducedState,
                    metricsLoading: true,
                };
            case actionTypes.item.metrics.SUCCESS:
                return {
                    ...state,
                    results: !exists ? [...state.results, {
                        pkhash: payload.pkhash,
                        metrics: {content: payload.metricsContent},
                    }] : state.results.reduce((p, c) => [
                        ...p,
                        ...(c.pkhash === payload.pkhash ? [{
                            ...c,
                            metrics: {
                                ...c.metrics,
                                content: payload.metricsContent,
                            },
                        }] : [c]),
                    ], []),
                    metricsLoading: false,
                };
            case actionTypes.item.metrics.FAILURE:
                return {
                    ...reducedState,
                    metricsLoading: false,
                };
            default:
                return reducedState;
        }
    };
};
