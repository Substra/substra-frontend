import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getItem, getOrderedResults} from '../../selector';
import List from './index';

const mapStateToProps = (state, {
    model, filterUp, downloadFile, addNotification, download,
}) => ({
    init: state[model].list.init,
    loading: state[model].list.loading,
    results: getOrderedResults(state, model),
    selected: state[model].list.selected,
    order: state[model].order,
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


export default connect(mapStateToProps, mapDispatchToProps)(List);
