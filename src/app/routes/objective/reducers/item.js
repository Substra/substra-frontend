import baseReducerBuilder, {initialState as baseInitialState} from '../../../common/reducers/item';

const initialState = {
    ...baseInitialState,
    leaderboardLoading: false,
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
            case actionTypes.item.leaderboard.REQUEST:
                return {
                    ...state,
                    leaderboardLoading: true,
                };
            case actionTypes.item.leaderboard.SUCCESS:
                return {
                    ...state,
                    results: !exists ? [...state.results, {
                        key: payload.key,
                        leaderboard: payload.leaderboard,
                    }] : state.results.reduce((p, c) => [
                        ...p,
                        ...(c.key === payload.key ? [{
                            ...c,
                            leaderboard: payload.leaderboard,
                        }] : [c]),
                    ], []),
                    leaderboardLoading: false,
                };
            case actionTypes.item.leaderboard.FAILURE:
                return {
                    ...state,
                    leaderboardLoading: false,
                };
            default:
                return reducedState;
        }
    };
};
