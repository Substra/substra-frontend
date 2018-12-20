/* global window */

import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'react-emotion';
import {flatten, isEmpty} from 'lodash';
import {connect} from 'react-redux';
import uuidv4 from 'uuid/v4';
import {bindActionCreators} from 'redux';
import copy from 'copy-to-clipboard';

import {Snackbar} from '@material-ui/core';
import SnackbarContent from './SnackbarContent';

import searchActions from '../../search/actions';
import {getItem} from '../selector';

import ListContainer from './list';
import Detail from './detail';
import Check from '../svg/check';
import {tealish} from '../../../../../assets/css/variables';

const MIN_COL_WIDTH = 50;

export const middle = css`
    display: inline-block;
    vertical-align: top;
`;

export const margin = 20;
const barSize = 15;

export const verticalBar = css`
    ${middle};
    width: ${barSize}px;
    margin-right: -${(barSize - 1) / 2}px;
    margin-left: -${(barSize - 1) / 2}px;
    z-index: 1;
    cursor: col-resize;
    background-color: transparent;
    
    position: relative;
    :before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: ${(barSize - 1) / 2}px;
        border-left: 1px solid #ccc;    
    }
`;

const lightGrey = '#fafafa';

export const snackbarContent = css`
    color: ${tealish};
    background-color: ${lightGrey};
    
    @media (min-width: 960px) {
        min-width: 200px;
    }    
`;

export const ClipboardContent = styled('div')`
    ${middle};
    margin-left: 15px;
    input {
        display: block;
        padding: 3px 0;
        border: 1px solid #9b9b9b;
        color: #9b9b9b;
        background-color: transparent;
        outline: none;
        width: 100%;
    }
    
    p {
        color: #4b6073;
        font-size: 13px;
        margin: 4px 0 0;
    }
`;

export const anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'left',
};

export class Base extends Component {
    state = {
        width: {
            list: {value: 40, unit: '%'},
            detail: {value: 59, unit: '%'},
        },
        hold: false,
        clipboard: {
            open: false,
            inputValue: '',
            text: '',
        },
    };

    constructor(props) {
        super(props);
        this.contentRef = React.createRef();
    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState(state => ({
            ...state,
            clipboard: {
                ...state.clipboard,
                open: false,
            },
        }));
    };

    updateDimensions = () => {
        if (this.contentRef.current) {
            const oldWidth = this.state.width.list.value + this.state.width.detail.value,
                newWidth = this.contentRef.current.offsetWidth;

            this.setState(state => ({
                ...state,
                width: {
                    list: {value: state.width.list.value * newWidth / oldWidth, unit: 'px'},
                    detail: {value: state.width.detail.value * newWidth / oldWidth, unit: 'px'},
                },
            }));
        }
    };

    move = (e) => {
        if (this.state.hold) {
            e.persist();

            const offsetWidth = e.currentTarget.offsetWidth;
            // prevent list and detail panels from being less than MIN_COL_WIDTH px
            const listWidth = Math.min(Math.max(MIN_COL_WIDTH, e.clientX - margin), offsetWidth - MIN_COL_WIDTH);
            const detailWidth = offsetWidth - listWidth - barSize;

            this.setState(state => ({
                    ...state,
                    width: {
                        list: {value: listWidth, unit: 'px'},
                        detail: {value: detailWidth, unit: 'px'},
                    },
                }
            ));
        }
    };

    mouseDown = () => this.setState(state => ({
        ...state,
        hold: true,
    }));

    mouseUp = () => {
        if (this.state.hold) {
            this.setState(state => ({
                ...state,
                hold: false,
            }));
        }
    };

    addNotification = (inputValue, text) => {
        copy(inputValue);

        this.setState(state => ({
            ...state,
            clipboard: {
                open: true,
                inputValue,
                text,
            },
        }));
    };

    filterUp = (o) => {
        const {setSearchState, selectedItem, model} = this.props;

        const newSelectedItem = [
            ...selectedItem,
            // This is the -OR- case
            // ...(selectedItem.length && !last(selectedItem).isLogic ? [{
            //     parent: '-OR-',
            //     isLogic: true,
            //     uuid: uuidv4(),
            // }] : []),
            {
                parent: model,
                child: `name:${o}`,
                isLogic: false,
                uuid: uuidv4(),
            }];

        setSearchState({
            isParent: true,
            inputValue: '',
            selectedItem: newSelectedItem,
            item: o,
            toUpdate: true,
        });
    };

    downloadFile = (o) => {
        // we need to act as a proxy as we need to pass the version for downloading th efile

        const {
            fetchFile, item, results, download: {address, filename},
        } = this.props;

        // item can be empty if we download from list with no expand on item
        const object = item && !isEmpty(item) ? item : flatten(results).find(x => x.key === o);

        const url = object ? address.reduce((p, c) => p[c], object) : '';

        fetchFile({url, filename});
    };

    list = () => css`
        ${middle};
        width: ${this.props.selected ? `${this.state.width.list.value}${this.state.width.list.unit}` : '100%'};
        overflow-x: auto;
    `;

    detail = () => css`
        ${middle};
        width: ${this.props.selected ? `${this.state.width.detail.value}${this.state.width.detail.unit}` : '100%'};
        overflow-x: auto;
    `;

    layout = () => css`
        margin: 0 ${margin}px;
        display: flex;
        flex: 1;
        ${this.state.hold ? `
            cursor: col-resize;
            user-select: none;
        ` : ''}
    `;

    render() {
        const {
            selected, actions, model, download,
            List, Detail,
        } = this.props;

        const {clipboard: {open, text, inputValue}} = this.state;

        return (
            <div
                ref={this.contentRef}
                onMouseMove={this.move}
                onMouseUp={this.mouseUp}
                className={this.layout()}
            >
                <List
                    className={this.list()}
                    model={model}
                    actions={actions}
                    filterUp={this.filterUp}
                    downloadFile={this.downloadFile}
                    addNotification={this.addNotification}
                    download={download}
                />
                {selected && (
                <Fragment>
                    <div
                        onMouseDown={this.mouseDown}
                        className={verticalBar}
                    />
                    <Detail
                        className={this.detail()}
                        model={model}
                        actions={actions}
                        filterUp={this.filterUp}
                        downloadFile={this.downloadFile}
                        addNotification={this.addNotification}
                    />
                </Fragment>)
            }
                <Snackbar
                    anchorOrigin={anchorOrigin}
                    open={open}
                    onClose={this.handleClose}
                    autoHideDuration={2000}
                >
                    <SnackbarContent
                        className={snackbarContent}
                        message={(
                            <div>
                                <Check color={tealish} className={middle} />
                                <ClipboardContent>
                                    <input disabled value={inputValue} />
                                    <p>
                                        {text}
                                    </p>
                                </ClipboardContent>
                            </div>)
                    }
                    />
                </Snackbar>
            </div>
);
    }
}

const noop = () => {
};

Base.defaultProps = {
    selected: null,
    selectedItem: [],
    item: null,
    setSearchState: noop,
    fetchFile: noop,
    download: {},
    results: [],
    List: ListContainer,
    Detail,
};

Base.propTypes = {
    selected: PropTypes.string,
    actions: PropTypes.shape({}).isRequired,
    model: PropTypes.string.isRequired,
    item: PropTypes.shape({
        key: PropTypes.string,
        descriptionStorageAddress: PropTypes.string,
        description: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({}),
        ]),
    }),
    download: PropTypes.shape({
        address: PropTypes.arrayOf(PropTypes.string),
        filename: PropTypes.string,
    }),
    results: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    selectedItem: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.arrayOf(PropTypes.shape({}))]),
    setSearchState: PropTypes.func,
    fetchFile: PropTypes.func,
    List: PropTypes.func,
    Detail: PropTypes.func,
};

// Basic customisable redux mapping
const ReduxBase = (B = Base) => { // no override on List/Detail, neither principal Component
    const mapStateToProps = (state, {model, actions, download}) => ({
        selected: state[model].list.selected,
        results: state[model].list.results,
        selectedItem: state.search.selectedItem,
        model,
        actions,
        download,
        item: getItem(state, model),
    });

    const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
        setSearchState: searchActions.state.set,
        fetchFile: actions.item.file.request,
    }, dispatch);

    return connect(mapStateToProps, mapDispatchToProps)(B);
};

export default ReduxBase;
