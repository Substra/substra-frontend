import list from '../../../common/reducers/list';
import item from '../../../common/reducers/item';
import persistent from '../../../common/reducers/persistent';
import order from '../../../common/reducers/order';
import {actionTypes} from '../actions';

export default {
    list: list(actionTypes),
    item: item(actionTypes),
    persistent: persistent(actionTypes),
    order: order(actionTypes),
};
