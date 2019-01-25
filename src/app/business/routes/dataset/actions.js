import {createAction} from 'redux-actions';
import createRequestActionTypes from '../../../actions/createRequestActionTypes';

const prefix = 'SUBSTRA__DATASET';

export const actionTypes = {
    list: {
        ...createRequestActionTypes(`${prefix}_LIST`),
        SELECTED: `${prefix}_LIST_SELECTED`,
        UNSELECT: `${prefix}_LIST_UNSELECT`,
    },

    item: {
        ...createRequestActionTypes(`${prefix}_ITEM`),
        description: createRequestActionTypes(`${prefix}_ITEM_DESCRIPTION`),
        file: createRequestActionTypes(`${prefix}_ITEM_FILE`),
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
        unselect: createAction(actionTypes.list.UNSELECT),
    },

    item: {
        request: createAction(actionTypes.item.REQUEST),
        success: createAction(actionTypes.item.SUCCESS),
        failure: createAction(actionTypes.item.FAILURE),
        description: {
            request: createAction(actionTypes.item.description.REQUEST),
            success: createAction(actionTypes.item.description.SUCCESS),
            failure: createAction(actionTypes.item.description.FAILURE),
        },
        file: {
            request: createAction(actionTypes.item.file.REQUEST),
            success: createAction(actionTypes.item.file.SUCCESS),
            failure: createAction(actionTypes.item.file.FAILURE),
        },
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
