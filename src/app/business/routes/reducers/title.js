const DEFAULT = 'Owkestra';

export default (state = DEFAULT, action = {}) => {
    switch (action.type) {
        case 'HOME':
        case 'OBJECTIVE':
            return `Objective - ${DEFAULT}`;
        case 'DATASET':
            return `Dataset - ${DEFAULT}`;
        case 'ALGORITHM':
            return `Algorithm - ${DEFAULT}`;
        case 'MODEL':
            return `Model - ${DEFAULT}`;
        default:
            return state;
    }
};
