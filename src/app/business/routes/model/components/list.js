import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// use custom selector
import {getItem} from '../../../common/selector';
import {getOrderedResults} from '../selector';


import {L} from '../../../common/components/list';


const Title = ({o}) =>
    <h4>
        {o && o.algo ? o.algo.hash : ''}
    </h4>;

const mapStateToProps = (state, {model, filterUp, downloadFile, addNotification, download}) => ({
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
    Title,
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    fetchList: actions.list.request,
    setSelected: actions.list.selected,
    setOrder: actions.order.set,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(L);
