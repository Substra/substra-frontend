import {createAction} from 'redux-actions';

const prefix = 'SUBSTRA__SEARCH';

export const actionTypes = {
    state: {
        SET: `${prefix}_STATE_SET`,
    },
    updated: {
        SET: `${prefix}_UPDATED_SET`,
    },
};


export default {
    state: {
        set: createAction(actionTypes.state.SET),
    },
    updated: {
        set: createAction(actionTypes.updated.SET),
    },
};
