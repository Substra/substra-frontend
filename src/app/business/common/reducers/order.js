const defaultInitialState = {
    by: 'name',
    direction: 'asc',
    pristine: true,
};

export default (actionTypes, initialState = defaultInitialState) => (state = initialState, {type, payload}) => {
    switch (type) {
        case actionTypes.order.SET:
            return {
                ...state,
                ...payload,
                pristine: false,
            };
        default:
            return state;
    }
};
