import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getOrderedResults} from '../../../model/selector';
import {getItem, getSelected} from '../../../../common/selector';
import PopoverItems from './components/popoverItems';

import {withListAnalytics} from '../../../../common/components/list/analytics';
import List from './index';

const ListWithAnalytics = withListAnalytics(List);

const mapStateToProps = (state, {
    model, filterUp, downloadFile, download, addNotification, more,
}) => ({
    init: state[model].list.init,
    loading: state[model].list.loading,
    itemLoading: state[model].item.loading,
    itemResults: state[model].item.results,
    results: getOrderedResults(state, model),
    selected: getSelected(state, model),
    order: state[model].order,
    item: getItem(state, model),
    model,
    download,
    filterUp,
    downloadFile,
    addNotification,
    more,
    PopoverItems,
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    fetchList: actions.list.request,
    setSelected: actions.list.selected,
    setOrder: actions.order.set,
    fetchItem: actions.item.request,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(ListWithAnalytics);
