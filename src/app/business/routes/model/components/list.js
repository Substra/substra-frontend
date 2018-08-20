import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {L as List} from '../../../common/components/list';


// use custom selector
import {getColumns, getOrderedResults} from '../selector';


const mapStateToProps = (state, {model}) => ({
    init: state[model].list.init,
    loading: state[model].list.loading,
    results: getOrderedResults(state, model),
    selected: state[model].list.selected,
    order: state[model].order,
    columns: getColumns(state, model),
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    fetchList: actions.list.request,
    setSelected: actions.list.selected,
    setOrder: actions.order.set,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(List);
