import {createSelector} from 'reselect';

const error = state => state.user.error;

export const getError = createSelector([error],
    error => error && error.message ? JSON.parse(error.message) : error,
);

export default {
    getError,
};
