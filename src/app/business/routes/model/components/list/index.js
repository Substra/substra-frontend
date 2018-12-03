import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {css} from 'react-emotion';

// use custom selector
import {getItem} from '../../../../common/selector';
import {getOrderedResults} from '../../selector';


import {List} from '../../../../common/components/list/index';
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

    itemWrapper = (key) => {
        // this.state.hoverItem works with current Ract List
        // this.props.hoverItem work from Base hovering (dynamic from Chart)
        const hover = this.state.hoverItem === key || this.props.hoverKey === key;

        return css`
            padding: 10px;
            border-left: 4px solid ${this.isSelected(key) || hover ? '#edc20f' : 'transparent'};
            ${!this.isSelected(key) && hover ? this.borderHover : ''}
        `;
    };
}

const Description = ({o}) => (
    <div className={desc}>
        {o && o.testData && o.testData.perf}
    </div>
);

Description.propTypes = {
    o: PropTypes.shape({
        testData: PropTypes.shape(),
    }),
};

Description.defaultProps = {
    o: null,
};

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

Title.propTypes = {
    o: PropTypes.shape(),
};

Title.defaultProps = {
    o: null,
};

const mapStateToProps = (state, {
    model, filterUp, downloadFile, addNotification, download,
}) => ({
    init: state[model].list.init,
    loading: state[model].list.loading,
    results: getOrderedResults(state, model),
    selected: state[model].list.selected,
    order: state[model].order,
    item: getItem(state, model),
    hoverKey: state[model].chart.hoverKey,
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
