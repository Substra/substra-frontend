import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled, {css} from 'react-emotion';
import {PulseLoader} from 'react-spinners';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Popover from '@material-ui/core/Popover';


import {coolBlue} from '../../../../../assets/css/variables/index';

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

const PopList = styled('div')`
    list-style: none;
    margin: 0;
    li { 
        cursor: pointer;
        padding: 10px 15px;
        border-bottom: 1px solid #eeeeee;
        font-size: 13px;
        
        &:hover {
            background-color: #f0f0ef;
        }
        
        span, svg {
            display: inline-block;
            vertical-align: middle;
        }
        
        span { margin-left: 5px; }
    }   
`;

export class L extends Component {
    state = {
        popover: {
            open: false,
            anchorEl: null,
            item: null,
        },
    };

    componentDidMount(prevProps, prevState, snapshot) {
        const {loading, fetchList} = this.props;

        if (!loading) {
            fetchList();
        }
    }

    setSelected = item => () => {
        const {setSelected} = this.props;

        setSelected(item);
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


    filterUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.props.filterUp(this.state.popover.item.name);

        this.popoverHandleClose();
    };

    downloadFile = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {downloadFile} = this.props;

        downloadFile();

        this.popoverHandleClose();
    };

    addNotification = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {addNotification} = this.props;

        addNotification(this.state.popover.item.key);

        this.popoverHandleClose();
    };

    more = o => (e) => {
        e.preventDefault();
        e.stopPropagation();

        // display menu
        this.setState({
            popover: {
                open: true,
                anchorEl: e.currentTarget,
                item: o,
            },
        });
        e.persist();
    };

    popoverHandleClose = () => {
        this.setState(state => ({
            popover: {
                open: false,
                anchorEl: null,
                item: null,
            },
        }));
    };

    render() {
        const {
            results, init, loading, order, model, className, download,
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
                {loading && <PulseLoader size={6} color={coolBlue}/>}
                {init && !loading && !results.length && (
                    <p>
                        There is no items
                    </p>
                )}
                {init && !loading && !!results.length
                && (results.map((o, i) => (
                        <Group key={i}>
                            {!!o.length && o.map(o => (
                                <Item key={o.key} onClick={this.setSelected(o)} className={this.item(o.key)}>
                                    <Actions>
                                        <More height={16} onClick={this.more(o)}/>
                                    </Actions>
                                    <h4 className={this.title(o.key)}>
                                        {o.name}
                                    </h4>
                                    <Content>
                                        {o.permissions === 'all' && (
                                            <Fragment>
                                                <Permission width={8} height={8}/>
                                            </Fragment>)
                                        }
                                        <Desc>
                                            {o.metrics && (
                                                <span>
                                                {`Metric: ${o.metrics.name}`}
                                            </span>)
                                            }
                                            {/* <span>{o.shortDescription}</span> */}
                                        </Desc>
                                    </Content>
                                </Item>
                            ))}
                            {!o.length && (
                                <span>
                            No items for this filter group
                        </span>)}
                        </Group>))
                )}
                <Popover
                    open={this.state.popover.open}
                    anchorEl={this.state.popover.anchorEl}
                    onClose={this.popoverHandleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <PopList>
                        <li onClick={this.filterUp}>
                            <span>
                                Add as a filter
                            </span>
                        </li>
                        <li>
                            <CopyToClipboard text={this.state.popover.item ? this.state.popover.item.key : ''}>
                                <span onClick={this.addNotification}>
                                    {`Copy ${model}'s key to clipboard`}
                                </span>
                            </CopyToClipboard>
                        </li>
                        <li onClick={this.downloadFile}>
                            <span>
                                {download.text}
                            </span>
                        </li>
                    </PopList>
                </Popover>
            </div>
        );
    }
}

const noop = () => {
};

L.defaultProps = {
    init: false,
    loading: false,
    results: [],
    selected: '',
    order: {by: '', direction: 'asc'},
    className: '',
    model: '',
    setSelected: noop,
    setOrder: noop,
    fetchList: noop,
    filterUp: noop,
    downloadFile: noop,
    addNotification: noop,
};

L.propTypes = {
    init: PropTypes.bool,
    loading: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    selected: PropTypes.string,
    order: PropTypes.shape({}),
    className: PropTypes.string,
    model: PropTypes.string,
    setSelected: PropTypes.func,
    setOrder: PropTypes.func,
    fetchList: PropTypes.func,
    filterUp: PropTypes.func,
    downloadFile: PropTypes.func,
    addNotification: PropTypes.func,
};

const mapStateToProps = (state, {model, filterUp, downloadFile, addNotification, download}) => ({
    init: state[model].list.init,
    loading: state[model].list.loading,
    results: getOrderedResults(state, model),
    selected: state[model].list.selected,
    order: state[model].order,
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

export default connect(mapStateToProps, mapDispatchToProps)(L);
