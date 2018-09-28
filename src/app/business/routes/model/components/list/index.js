import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// use custom selector
import {getItem} from '../../../../common/selector';
import {getOrderedResults} from '../../selector';


import {List} from '../../../../common/components/list';
import {desc} from '../../../../common/components/list/desc';

// update filterUp for using key
class Index extends List {
    filterUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {filterUp} = this.props;
        const {popover: {item: {key}}} = this.state;

        filterUp(key);

        this.popoverHandleClose();
    };
}

const Description = ({o}) => (
    <div className={desc}>
        {o.testData.perf}
    </div>
);

const Title = ({o}) => (
    <div>
        <h4>
            {o && o.algo ? `${o.algo.name}-${o.key.slice(0, 4)}` : ''}
        </h4>
        <span>
            {o && o.status}
        </span>
    </div>
);

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
    Title,
    Description,
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    fetchList: actions.list.request,
    setSelected: actions.list.selected,
    setOrder: actions.order.set,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Index);
