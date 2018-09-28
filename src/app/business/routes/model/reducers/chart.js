const initialState = {};

export default actionTypes => (state = initialState, {type, payload}) => {
    switch (type) {
        case actionTypes.chart.SAVE:
            return {
                ...state,
                ...payload,
            };
        default:
            return state;
    }
};
