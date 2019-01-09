import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {css} from 'emotion';
import {PulseLoader} from 'react-spinners';

import Popover from './components/popover';
import Title from './components/title';
import Description from './components/desc';

import {coolBlue} from '../../../../../../assets/css/variables/index';

import More from '../../svg/more-vertical';
import Permission from '../../svg/permission';


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
    border-top: 1px solid #ccc;
    font-size: 12px;
    cursor: pointer;
    position: relative;
`;

const Content = styled('div')`
    margin-top: 5px;
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

class List extends Component {
    state = {
        popover: {
            open: false,
            anchorEl: null,
            item: null,
        },
        hoverItem: null,
    };

    componentDidMount(prevProps, prevState, snapshot) {
        const {loading, fetchList, logList} = this.props;

        if (!loading) {
            fetchList();
        }
        logList();
    }

    setSelected = item => () => {
        const {setSelected, logDetail} = this.props;

        setSelected(item);
        logDetail(item.key);
    };

    hover = item => (e) => {
        e.stopPropagation();

        const {hover} = this.props;

        if (!this.isSelected(item.key)) {
            this.setState(state => ({
                ...state,
                hoverItem: item.key,
            }));

            if (hover) {
                hover(item);
            }
        }
    };

    out = item => (e) => {
        const {out} = this.props;

        e.stopPropagation();

        this.setState(state => ({
            ...state,
            hoverItem: null,
        }));

        if (out) {
            out(item);
        }
    };

    isSelected = (key) => {
        const {selected} = this.props;

        return selected === key;
    };

    borderHover = css`
            border-image-source: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAMCAYAAABFohwTAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gkbDiM0iNMMGAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAIUlEQVQI12N4e4j//9tD/P8ZoICJAQ1QQ4ARxoDZRBNbAElRCE0HEPWfAAAAAElFTkSuQmCC");
            border-image-slice: 0 0 0 4;
            border-image-repeat: repeat;
    `;

    itemWrapper = (key) => {
        // this.state.hoverItem works with current Ract List
        // this.props.hoverItem work from Base hovering (dynamic from Chart)
        const hover = this.state.hoverItem === key;

        return css`
            padding: 10px;
            border-left: 4px solid ${this.isSelected(key) || hover ? '#edc20f' : 'transparent'};
            ${!this.isSelected(key) && hover ? this.borderHover : ''}
        `;
    };

    createSortHandler = by => (e) => {
        const {order, setOrder} = this.props;

        const direction = order.by === by && order.direction === 'desc' ? 'asc' : 'desc';

        setOrder({direction, by});
    };


    filterUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {filterUp} = this.props;
        const {popover: {item: {name}}} = this.state;

        filterUp(name);

        this.popoverHandleClose();
    };

    downloadFile = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {downloadFile} = this.props;
        const {popover: {item: {key}}} = this.state;

        downloadFile(key);

        this.popoverHandleClose();
    };

    addNotification = text => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {addNotification} = this.props;

        addNotification(this.state.popover.item.key, text);

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
            results, init, loading, model, className, download,
            Title, Popover, Description,
        } = this.props;

        const {open, anchorEl} = this.state.popover;

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
                && (results.map((o, i) => (
                    <Group key={i}>
                        {!!o.length && o.map(o => (
                            <Item
                                key={o.key}
                                onClick={this.setSelected(o)}
                                onMouseEnter={this.hover(o)}
                                onMouseLeave={this.out(o)}
                            >
                                <div className={this.itemWrapper(o.key)}>
                                    <Actions>
                                        <More height={16} onClick={this.more(o)} />
                                    </Actions>
                                    <Title o={o} />
                                    <Content>
                                        {o.permissions === 'all' && (
                                        <Fragment>
                                            <Permission width={8} height={8} />
                                        </Fragment>)
                                            }
                                        <Description o={o} />
                                    </Content>
                                </div>
                            </Item>
                            ))}
                        {!o.length && (
                        <span>
                                    No items for this filter group
                        </span>)}
                    </Group>))
                )}
                <Popover
                    {...this.props}
                    open={open}
                    anchorEl={anchorEl}
                    model={model}
                    download={download}
                    filterUp={this.filterUp}
                    downloadFile={this.downloadFile}
                    addNotification={this.addNotification}
                    popoverHandleClose={this.popoverHandleClose}
                />
            </div>
        );
    }
}

const noop = () => {
};

const order = {by: '', direction: 'asc'};

List.defaultProps = {
    init: false,
    loading: false,
    results: [],
    selected: '',
    order,
    className: '',
    model: '',
    download: {},
    setSelected: noop,
    setOrder: noop,
    fetchList: noop,
    filterUp: noop,
    downloadFile: noop,
    addNotification: noop,
    Title,
    Popover,
    Description,
    logList: noop,
    logDetail: noop,
};

List.propTypes = {
    init: PropTypes.bool,
    loading: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    selected: PropTypes.string,
    order: PropTypes.shape({}),
    className: PropTypes.string,
    model: PropTypes.string,
    download: PropTypes.shape({
        address: PropTypes.arrayOf(PropTypes.string),
        filename: PropTypes.string,
    }),
    setSelected: PropTypes.func,
    setOrder: PropTypes.func,
    fetchList: PropTypes.func,
    filterUp: PropTypes.func,
    downloadFile: PropTypes.func,
    addNotification: PropTypes.func,
    Title: PropTypes.func,
    Popover: PropTypes.func,
    Description: PropTypes.func,
    logList: PropTypes.func,
    logDetail: PropTypes.func,
};

export default List;
