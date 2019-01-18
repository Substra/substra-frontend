import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {PulseLoader} from 'react-spinners';

import Popover from './components/popover';
import Title from './components/title';
import Sort from './components/sort';
import Item from './components/item';
import Actions from './components/actions';

import {coolBlue} from '../../../../../../assets/css/variables/index';
import {gold, offWhite} from '../../../../../../assets/css/variables/colors';
import PanelTop from '../panelTop';

import More from '../../svg/more-vertical';

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

    itemWrapper = (key) => {
        const hovered = this.state.hoverItem === key;
        const selected = this.isSelected(key);

        return css`
            position: relative;
            background-color: ${hovered || selected ? offWhite : 'transparent'};
            
            &:before {
                display: block;
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width 4px;
                background-color: ${selected ? gold : 'transparent'};
            }
        `;
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
            Title, Popover, Metadata, Sort, order, setOrder,
        } = this.props;

        const {open, anchorEl} = this.state.popover;

        return (
            <div className={className}>
                <PanelTop>
                    <Sort order={order} setOrder={setOrder} />
                </PanelTop>
                {loading && <PulseLoader size={6} color={coolBlue} />}
                {init && !loading && !results.length && (
                    <p>
                        There is no items
                    </p>
                )}
                {init && !loading && !!results.length
                && (results.map((o, i) => (
                    <div key={i}>
                        {!!o.length && o.map(o => (
                            <Item
                                key={o.key}
                                onClick={this.setSelected(o)}
                                onMouseEnter={this.hover(o)}
                                onMouseLeave={this.out(o)}
                                className={this.itemWrapper(o.key)}
                            >
                                <Actions>
                                    <More height={16} onClick={this.more(o)} />
                                </Actions>
                                <Title o={o} />
                                {Metadata && <Metadata o={o} />}
                            </Item>
                            ))}
                        {!o.length && (
                        <span>
                                    No items for this filter group
                        </span>
)}
                    </div>
))
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
    hover: noop,
    out: noop,
    Title,
    Popover,
    Metadata: null,
    logList: noop,
    logDetail: noop,
    Sort,
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
    hover: PropTypes.func,
    out: PropTypes.func,
    Title: PropTypes.func,
    Popover: PropTypes.func,
    Metadata: PropTypes.func,
    logList: PropTypes.func,
    logDetail: PropTypes.func,
    Sort: PropTypes.func,
};

export default List;
