import {createAction} from 'redux-actions';
import createRequestActionTypes from '../../actions/createRequestActionTypes';

export const actionTypes = {
    signIn: createRequestActionTypes('SIGN_IN'),
    signOut: createRequestActionTypes('SIGN_OUT'),
    modal: {
        SET: 'USER_MODAL_SET',
    },
};

export const signIn = {
    request: createAction(actionTypes.signIn.REQUEST),
    success: createAction(actionTypes.signIn.SUCCESS),
    failure: createAction(actionTypes.signIn.FAILURE),
};

export const signOut = {
    request: createAction(actionTypes.signOut.REQUEST),
    success: createAction(actionTypes.signOut.SUCCESS),
    failure: createAction(actionTypes.signOut.FAILURE),
};


export const modal = {
    set: createAction(actionTypes.modal.SET),
};


export default {
    signIn,
    signOut,
    modal,
};
