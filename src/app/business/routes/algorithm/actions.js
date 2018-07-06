import {createAction} from 'redux-actions';
import createRequestActionTypes from '../../../actions/createRequestActionTypes';

const prefix = 'SUBSTRA__ALGORITHM';

export const actionTypes = {
    list: {
        ...createRequestActionTypes(`${prefix}_LIST`),
        SELECTED: `${prefix}_LIST_SELECTED`,
    },

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

    order: {
        set: createAction(actionTypes.order.SET),
    },
};
