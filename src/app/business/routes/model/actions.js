import {createAction} from 'redux-actions';
import createRequestActionTypes from '../../../actions/createRequestActionTypes';

const prefix = 'SUBSTRA';

export const actionTypes = {
    list: createRequestActionTypes(`${prefix}__MODEL_LIST`),

};

export default {
    list: {
        request: createAction(actionTypes.list.REQUEST),
        success: createAction(actionTypes.list.SUCCESS),
        failure: createAction(actionTypes.list.FAILURE),
    },
};
