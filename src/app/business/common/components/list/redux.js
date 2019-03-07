import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getItem, getOrderedResults, getSelected} from '../../selector';
import ListWithAnalytics from './analytics';

const mapStateToProps = (state, {
    model, filterUp, downloadFile, addNotification, download,
}) => ({
    init: state[model].list.init,
    loading: state[model].list.loading,
    results: getOrderedResults(state, model),
    selected: getSelected(state, model),
    item: getItem(state, model),
    filterUp,
    downloadFile,
    addNotification,
    download,
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    fetchList: actions.list.request,
    setSelected: actions.list.selected,
    setOrder: actions.order.set,
}, dispatch);

export const withListRedux = Component => connect(mapStateToProps, mapDispatchToProps)(Component);

export default withListRedux(ListWithAnalytics);
