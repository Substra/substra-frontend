import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import styled from '@emotion/styled';
import {PulseLoader} from 'react-spinners';
import {noop} from 'lodash';

import Popover from './components/popover';
import PopoverItems from './components/popoverItems';
import Title from './components/title';
import DefaultSort from './components/sort';
import Item from './components/item';
import Actions from './components/actions';

import {iceBlueTwo, darkSkyBlue} from '../../../../../../assets/css/variables/colors';
import {PanelWrapper, PanelTop, PanelContent} from '../panel';
import IconButton from '../iconButton';

import More from '../../svg/more-vertical';
import {spacingNormal} from '../../../../../../assets/css/variables/spacing';
import NoItemFound from './components/noItemFound';

const PulseLoaderWrapper = styled('div')`
    margin: ${spacingNormal};
`;

class List extends React.Component {
    state = {
        popover: {
            open: false,
            anchorEl: null,
            item: null,
        },
        hoverItem: null,
    };

    componentDidMount(prevProps, prevState, snapshot) {
        const {
loading, fetchList, logList,
} = this.props;

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
            background-color: ${hovered || selected ? iceBlueTwo : 'transparent'};
            
            &:before {
                display: block;
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 4px;
                background-color: ${selected ? darkSkyBlue : 'transparent'};
            }
        `;
    };

    filterUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {filterUp, logFilterFromList} = this.props;
        const {popover: {item: {name, key}}} = this.state;

        filterUp(name);
        logFilterFromList(key);

        this.popoverHandleClose();
    };

    downloadFile = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {downloadFile, logDownloadFromList} = this.props;
        const {popover: {item: {key}}} = this.state;

        downloadFile(key);
        logDownloadFromList(key);

        this.popoverHandleClose();
    };

    addNotification = text => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {addNotification, logCopyFromList} = this.props;
        const {popover: {item: {key}}} = this.state;

        addNotification(key, text);
        logCopyFromList(key);

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
            Title, Popover, Metadata, PopoverItems, Sort, actions,
        } = this.props;

        const {open, anchorEl, item} = this.state.popover;

        return (
            <div className={className}>
                <PanelWrapper>
                    <PanelTop>
                        <Sort model={model} actions={actions} />
                    </PanelTop>
                    <PanelContent>
                        {loading && (
                            <PulseLoaderWrapper>
                                <PulseLoader size={6} />
                            </PulseLoaderWrapper>
                        )}
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
                                                <IconButton onClick={this.more(o)} title="Show actions" noBorder>
                                                    <More height={16} />
                                                </IconButton>
                                            </Actions>
                                            <Title o={o} />
                                            {Metadata && <Metadata o={o} />}
                                        </Item>
                                        ))
                                    }
                                    {!o.length && <NoItemFound model={model} />}
                                </div>
                            ))
                        )}
                    </PanelContent>
                </PanelWrapper>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    popoverHandleClose={this.popoverHandleClose}
                >
                    <PopoverItems
                        {...this.props}
                        model={model}
                        download={download}
                        filterUp={this.filterUp}
                        downloadFile={this.downloadFile}
                        addNotification={this.addNotification}
                        item={item}
                    />
                </Popover>
            </div>
        );
    }
}

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
    PopoverItems,
    Metadata: null,
    Sort: DefaultSort,
    logList: noop,
    logDetail: noop,
    logFilterFromList: noop,
    logDownloadFromList: noop,
    logCopyFromList: noop,
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
    PopoverItems: PropTypes.func,
    Metadata: PropTypes.func,
    Sort: PropTypes.func,
    logList: PropTypes.func,
    logDetail: PropTypes.func,
    logFilterFromList: PropTypes.func,
    logDownloadFromList: PropTypes.func,
    logCopyFromList: PropTypes.func,
    actions: PropTypes.shape().isRequired,
};

export default List;
