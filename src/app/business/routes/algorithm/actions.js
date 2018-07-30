import {createAction} from 'redux-actions';
import createRequestActionTypes from '../../../actions/createRequestActionTypes';

const prefix = 'SUBSTRA__ALGORITHM';

export const actionTypes = {
    list: {
        ...createRequestActionTypes(`${prefix}_LIST`),
        SELECTED: `${prefix}_LIST_SELECTED`,
    },

    persistent: createRequestActionTypes(`${prefix}_PERSISTENT`),

    order: {
        SET: `${prefix}_ORDER`,
    },
};

export default {
    list: {
        request: createAction(actionTypes.list.REQUEST),
        success: createAction(actionTypes.list.SUCCESS),
        failure: createAction(actionTypes.list.FAILURE),
        selected: createAction(actionTypes.list.SELECTED),
    },

    persistent: {
        request: createAction(actionTypes.persistent.REQUEST),
        success: createAction(actionTypes.persistent.SUCCESS),
        failure: createAction(actionTypes.persistent.FAILURE),
    },

    order: {
        set: createAction(actionTypes.order.SET),
    },
};
