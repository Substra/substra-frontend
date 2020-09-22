import baseReducerBuilder, {initialState} from '../../../common/reducers/item';

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
            default:
                return reducedState;
        }
    };
};
