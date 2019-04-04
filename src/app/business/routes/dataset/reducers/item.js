import baseReducerBuilder, {initialState as baseInitialState} from '../../../common/reducers/item';

const initialState = {
    ...baseInitialState,
    openerLoading: false,
};

export default (actionTypes) => {
    const baseReducer = baseReducerBuilder(actionTypes);
    return (state = initialState, {type, payload}) => {
        const reducedState = baseReducer(state, {type, payload});
        switch (type) {
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
            default:
                return reducedState;
        }
    };
};
