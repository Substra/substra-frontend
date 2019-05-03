/* global window */

import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {css} from 'emotion';
import {flatten, isEmpty, noop} from 'lodash';
import uuidv4 from 'uuid/v4';
import copy from 'copy-to-clipboard';

import {Snackbar} from '@material-ui/core';
import SnackbarContent from '../SnackbarContent';

import List from '../list/redux';
import Detail from '../detail/redux';
import Check from '../../svg/check';
import {spacingLarge, spacingNormal} from '../../../../../../assets/css/variables/spacing';
import {
white, primaryAccent, ice,
} from '../../../../../../assets/css/variables/colors';

const MIN_COL_WIDTH = 250;

export const middle = css`
    display: inline-block;
    vertical-align: top;
`;

export const margin = 40;
const barSize = 15;
const halfBarSize = (barSize - 1) / 2;

export const verticalBar = css`
    ${middle};
    width: ${barSize}px;
    margin-right: -${halfBarSize}px;
    margin-left: -${halfBarSize}px;
    z-index: 1;
    cursor: col-resize;
    background-color: transparent;
    flex-grow: 0;
    flex-shrink: 0;
    
    position: relative;
    :before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: ${halfBarSize}px;
        border-left: 1px solid ${ice};    
    }
`;

const lightGrey = '#fafafa';

export const snackbarContent = css`
    color: ${primaryAccent};
    background-color: ${lightGrey};
    
    @media (min-width: 960px) {
        min-width: 200px;
    }    
`;

export const ClipboardContent = styled('div')`
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

class Base extends Component {
    state = {
        listWidth: {value: 40, unit: '%'},
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
            const containerWidth = this.contentRef.current.offsetWidth;
            const listWidth = this.state.listWidth.unit === '%' ? this.state.listWidth.value * containerWidth / 100 : this.state.listWidth.value;

            this.updateListWidth(containerWidth, listWidth);
        }
    };

    move = (e) => {
        if (this.state.hold) {
            e.persist();

            const containerWidth = e.currentTarget.offsetWidth;
            const listWidth = e.clientX - margin - 1;
            this.updateListWidth(containerWidth, listWidth);
        }
    };

    updateListWidth(containerWidth, listWidth) {
        const MAX_COL_WIDTH = Math.max(0, containerWidth - MIN_COL_WIDTH);
        const actualListWidth = Math.min(Math.max(MIN_COL_WIDTH, listWidth), MAX_COL_WIDTH);

        this.setState(state => ({
                ...state,
                listWidth: {value: actualListWidth, unit: 'px'},
            }
        ));
    }

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
        const {
            setSearchState, selectedItem, model,
        } = this.props;

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
                child: `name:${encodeURIComponent(o)}`,
                isLogic: false,
                uuid: uuidv4(),
            }];

        setSearchState({
            isParent: true,
            inputValue: '',
            selectedItem: newSelectedItem,
            item: encodeURIComponent(o),
            toUpdate: true,
        });
    };

    downloadFile = (o) => {
        // we need to act as a proxy as we need to pass the version for downloading th efile

        const {
            downloadItem, item, results, download: {address, filename},
        } = this.props;

        // item can be empty if we download from list with no expand on item
        const object = item && !isEmpty(item) ? item : flatten(results).find(x => x.key === o);

        const url = object ? address.reduce((p, c) => p[c], object) : '';

        downloadItem({url, filename});
    };

    list = () => css`
        width: ${this.props.selected ? `${this.state.listWidth.value}${this.state.listWidth.unit}` : '100%'};
        flex-grow: 0;
        flex-shrink: 0;
        display: flex;
        overflow: hidden;
    `;

    detail = () => css`
        flex-grow: 1;
        display: flex;
        overflow: hidden;
    `;

    layout = () => css`
        margin: 0 ${spacingLarge} ${spacingNormal} ${spacingLarge};
        background-color: ${white};
        border: 1px solid ${ice};
        display: flex;
        flex: 1;
        align-items: stretch;
        overflow: hidden;
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
                </Fragment>
)
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
                                <Check color={primaryAccent} className={middle} />
                                <ClipboardContent className={middle}>
                                    <input disabled value={inputValue} />
                                    <p>
                                        {text}
                                    </p>
                                </ClipboardContent>
                            </div>
)
                    }
                    />
                </Snackbar>
            </div>
);
    }
}

Base.defaultProps = {
    selected: null,
    selectedItem: [],
    item: null,
    setSearchState: noop,
    downloadItem: noop,
    download: {},
    results: [],
    List,
    Detail,
};

Base.propTypes = {
    selected: PropTypes.string,
    actions: PropTypes.shape({}).isRequired,
    model: PropTypes.string.isRequired,
    item: PropTypes.shape({
        key: PropTypes.string,
        description: PropTypes.shape(),
    }),
    download: PropTypes.shape({
        address: PropTypes.arrayOf(PropTypes.string),
        filename: PropTypes.string,
    }),
    results: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    selectedItem: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.arrayOf(PropTypes.shape({}))]),
    setSearchState: PropTypes.func,
    downloadItem: PropTypes.func,
    List: PropTypes.elementType,
    Detail: PropTypes.elementType,
};

export default Base;
