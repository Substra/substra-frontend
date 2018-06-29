import list from '../../../common/reducers/list';
import order from '../../../common/reducers/order';
import {actionTypes} from "../actions";

export default {
    list: list(actionTypes),
    order: order(actionTypes),
};
