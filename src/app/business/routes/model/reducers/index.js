import list from './list';
import item from '../../../common/reducers/item';
import persistent from '../../../common/reducers/persistent';
import order from '../../../common/reducers/order';
import {actionTypes} from '../actions';

const orderInitialState = {
    by: 'testtuple.data.perf',
    direction: 'desc',
    pristine: true,
};

export default {
    list: list(actionTypes),
    item: item(actionTypes),
    persistent: persistent(actionTypes),
    order: order(actionTypes, orderInitialState),
};
