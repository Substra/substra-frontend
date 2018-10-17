const initialState = {
    chart: null,
    hoverKey: null,
};

export default actionTypes => (state = initialState, {type, payload}) => {
    switch (type) {
        case actionTypes.chart.SAVE:
            return {
                ...state,
                chart: payload,
            };
        case actionTypes.chart.hoverKey.SET:
            return {
                ...state,
                hoverKey: payload,
            };
        default:
            return state;
    }
};
