import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled, {css} from 'react-emotion';
import uuidv4 from 'uuid/v4';
import {PulseLoader} from 'react-spinners';
import {last} from 'lodash';

import searchActions from '../../search/actions';

import {coolBlue} from '../../../../../assets/css/variables/index';

import FilterUp from '../svg/filter-up';
import More from '../svg/more-vertical';
import {getOrderedResults} from '../selector';
import Permission from '../svg/permission';


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
    margin: 0 0 15px;
    border-top: 2px solid #5796ff;
    padding: 0 0 15px 0;
`;

const Item = styled('div')`
    padding: 10px;
    border-top: 1px solid #ccc;
    font-size: 12px;
    cursor: pointer;
    position: relative;
`;

const Content = styled('div')`
    margin-top: 5px;
`;

const Desc = styled('div')`
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
`;

const Actions = styled('div')`
    position: absolute;
    right: 30px;
    top: 0;
    
    svg {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
    }
`;

export class L extends Component {
    componentDidMount(prevProps, prevState, snapshot) {
        const {loading, fetchList} = this.props;

        if (!loading) {
            fetchList();
        }
    }

    setSelected = key => () => {
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


    filterUp = o => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {setSearchState, selectedItem, model} = this.props;

        const newSelectedItem = [
            ...selectedItem,
            ...(selectedItem.length && !last(selectedItem).isLogic ? [{
                parent: '-OR-',
                isLogic: true,
                uuid: uuidv4(),
            }] : []),
            {
                parent: model,
                child: `name:${o.name}`,
                isLogic: false,
                uuid: uuidv4(),
            }];

        setSearchState({
            isParent: true,
            inputValue: '',
            selectedItem: newSelectedItem,
            item: o.name,
            toUpdate: true,
        });
    };

    more = o => (e) => {
        e.preventDefault();
        e.stopPropagation();

        // display menu
    };

    render() {
        const {
            results, init, loading, order, model, className,
        } = this.props;

        return (
            <div className={className}>
                <Top>
                    <H5>
                        {model.toUpperCase()}
                    </H5>
                    <Sort>
                        <span>
                            Sort by LATEST
                        </span>
                    </Sort>
                </Top>
                {loading && <PulseLoader size={6} color={coolBlue} />}
                {init && !loading && !results.length && (
                    <p>
                        There is no items
                    </p>
                )}
                {init && !loading && !!results.length
                && (
                    results.map((o, i) => (
                        <Group key={i}>
                            {!!o.length && o.map(o => (
                                <Item key={o.key} onClick={this.setSelected(o.key)} className={this.item(o.key)}>
                                    <Actions>
                                        <FilterUp onClick={this.filterUp(o)} />
                                        <More height={16} onClick={this.more(o)} />
                                    </Actions>
                                    <h4 className={this.title(o.key)}>
                                        {o.name}
                                    </h4>
                                    <Content>
                                        {o.permissions === 'all' && (
                                            <Fragment>
                                                <Permission width={8} height={8} />
                                            </Fragment>)
                                        }
                                        <Desc>
                                            {o.metrics && (
                                            <span>
                                                {`Metric: ${o.metrics.name}`}
                                            </span>
)
                                            }
                                            {/* <span>{o.shortDescription}</span> */}
                                        </Desc>
                                    </Content>
                                </Item>
                            ))}
                            {!o.length && (
                            <span>
No items for this filter group
                            </span>
)}
                        </Group>
                    ))
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, {model}) => ({
    selectedItem: state.search.selectedItem,
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
    setSearchState: searchActions.state.set,
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
    selectedItem: [],
    model: '',
    setSelected: noop,
    setOrder: noop,
    setSearchState: noop,
    fetchList: noop,
};

L.propTypes = {
    init: PropTypes.bool,
    loading: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    selected: PropTypes.string,
    order: PropTypes.shape({}),
    className: PropTypes.string,
    selectedItem: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.arrayOf(PropTypes.shape({}))]),
    model: PropTypes.string,
    setSelected: PropTypes.func,
    setOrder: PropTypes.func,
    setSearchState: PropTypes.func,
    fetchList: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(L);
