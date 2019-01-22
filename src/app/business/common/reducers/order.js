const defaultInitialState = {
    by: 'name',
    direction: 'asc',
    prune: false,
};

export default (actionTypes, initialState = defaultInitialState) => (state = initialState, {type, payload}) => {
    switch (type) {
        case actionTypes.order.SET:
            return {
                ...state,
                ...payload,
                prune: true,
            };
        default:
            return state;
    }
};
