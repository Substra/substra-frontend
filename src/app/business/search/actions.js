import {createAction} from 'redux-actions';

const prefix = 'SUBSTRA__SEARCH';

export const actionTypes = {
    filters: {
        SET: `${prefix}_FILTERS_SET`,
    },
    item: {
        SET: `${prefix}_ITEM_SET`,
    },
};

export default {
    filters: {
        set: createAction(actionTypes.filters.SET),
    },
    item: {
        set: createAction(actionTypes.item.SET),
    },
};
