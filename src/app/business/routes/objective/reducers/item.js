import baseReducerBuilder, {initialState as baseInitialState} from '../../../common/reducers/item';

const initialState = {
    ...baseInitialState,
    metricsLoading: false,
    tabIndex: 0,
};

export default (actionTypes) => {
    const baseReducer = baseReducerBuilder(actionTypes);
    return (state = initialState, {type, payload}) => {
       const reducedState = baseReducer(state, {type, payload});
        switch (type) {
            case actionTypes.item.metrics.REQUEST:
                return {
                    ...reducedState,
                    metricsLoading: true,
                };
            case actionTypes.item.metrics.SUCCESS:
                return {
                    ...reducedState,
                    init: true,
                    results: reducedState.results.reduce((p, c) => [
                        ...p,
                        ...(c.pkhash === payload.id ? [{...c, metrics: {...c.metrics, content: payload.metrics}}] : [c]),
                    ], []),
                    metricsLoading: false,
                };
            case actionTypes.item.metrics.FAILURE:
                return {
                    ...reducedState,
                    metricsLoading: false,
                };
            case actionTypes.item.tabIndex.SET:
                return {
                    ...state,
                    tabIndex: payload,
                };
            default:
                return reducedState;
        }
    };
};
