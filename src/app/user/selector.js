import {createSelector} from 'reselect';

const error = (state) => state.user.error;

export const getError = createSelector([error],
    (error) => {
        let err = error;
        if (error && error.message) {
            try {
                err = JSON.parse(error.message);
            }
            catch (e) {
                // continue regardless of error
            }
        }
        return err ? err.detail || err.message : err;
    },
);

export default {
    getError,
};
