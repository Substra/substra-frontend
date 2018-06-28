import {createAction} from 'redux-actions';

const prefix = 'GENERAL';

export const actionTypes = {
    error: {
        SET: `${prefix}_500_SET`,
    },
};

export default {
    error: {
        set: createAction(actionTypes.error.SET),
    },
};
