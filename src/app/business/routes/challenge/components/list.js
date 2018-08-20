import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled, {css} from 'react-emotion';

import {PulseLoader} from 'react-spinners';

import {coolBlue} from '../../../../../../assets/css/variables/index';


import {getOrderedResults} from '../../../common/selector';

const Top = styled('div')`
    background-color: #f7f8f8;
    padding: 3px 10px;
    color: #4b6073;
`;

const H5 = styled('h5')`
    margin: 0;
    display: inline-block;
    padding-right: 5px;
    border-right: 1px solid rgba(75, 96, 115, 0.2);
`;

const Sort = styled('div')`
    font-size: 14px;
    display: inline-block;
    padding-left: 5px;
`;

const Group = styled('div')`
    margin: 0 0 5px;
    border-top: 2px solid #000;
    padding: 0 0 5px 0;
`;

const Item = styled('div')`
    padding: 10px;
    border-top: 1px solid #ccc;
    font-size: 12px;
    cursor: pointer;
`;

export class L extends Component {
    constructor(props) {
        super(props);

        // load items
        if (!props.init && typeof window !== 'undefined') {
            props.fetchList();
        }
    }

    setSelected = (key) => (event) => {
        const {setSelected} = this.props;

        setSelected(key);
    };

    isSelected = (key) => {
        const {selected} = this.props;

        return selected === key;
    };

    item = key => css`
        border-left: 3px solid ${this.isSelected(key) ? '#edc20f' : 'transparent'};
    `;

    title = key => css`
        color: ${this.isSelected(key) ? '#edc20f' : 'inherit'};
    `;

    createSortHandler = by => (e) => {
        const {order, setOrder} = this.props;

        const direction = order.by === by && order.direction === 'desc' ? 'asc' : 'desc';

        setOrder({direction, by});
    };

    render() {
        const {
            results, init, loading, order, model, className,
        } = this.props;

        return <div className={className}>
            <Top>
                <H5>{model.toUpperCase()}</H5>
                <Sort>
                    <span>Sort by LATEST</span>
                </Sort>
            </Top>
            {loading && <PulseLoader size={6} color={coolBlue}/>}
            {init && !loading && !results.length && (
                <p>
                    There is no items
                </p>
            )}
            {init && !loading && !!results.length
            && (
                results.map((o, i) => (
                    <Group key={i}>
                        {o.map(o => (
                            <Item key={o.key} onClick={this.setSelected(o.key)} className={this.item(o.key)}>
                                <h4 className={this.title(o.key)}>{o.name}</h4>
                                <span>{o.permissions}</span>
                            </Item>
                        ))}
                    </Group>
                ))
            )}
        </div>;
    }
}

const mapStateToProps = (state, {model}) => ({
    init: state[model].list.init,
    loading: state[model].list.loading,
    results: getOrderedResults(state, model),
    selected: state[model].list.selected,
    order: state[model].order,
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    fetchList: actions.list.request,
    setSelected: actions.list.selected,
    setOrder: actions.order.set,
}, dispatch);

const noop = () => {
};

L.defaultProps = {
    init: false,
    loading: false,
    results: [],
    selected: '',
    order: {by: '', direction: 'asc'},
    className: '',
    fetchList: noop,
    setSelected: noop,
    setOrder: noop,
};

L.propTypes = {
    init: PropTypes.bool,
    loading: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    selected: PropTypes.string,
    order: PropTypes.shape({}),
    className: PropTypes.string,
    fetchList: PropTypes.func,
    setSelected: PropTypes.func,
    setOrder: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(L);
