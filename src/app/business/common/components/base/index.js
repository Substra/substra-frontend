import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {flatten, isEmpty, noop} from 'lodash';
import uuidv4 from 'uuid/v4';
import {Snackbar} from '@material-ui/core';
import {Check, TwoPanelLayout, withAddNotification} from '@substrafoundation/substra-ui';
import SnackbarContent from './components/snackbarContent';

import List from '../list/redux';
import Detail from '../detail/redux';
import {primaryAccent} from '../../../../../../assets/css/variables/colors';

export const middle = css`
    display: inline-block;
    vertical-align: top;
`;

export const margin = 40;

class Base extends Component {
    state = {
        clipboard: {
            open: false,
            key: '',
            text: '',
        },
    };

    // Notifications methods
    processNotificationQueue = () => {
        if (this.queuedNotification) {
            this.setState((state) => {
                const queuedNotification = this.queuedNotification;
                this.queuedNotification = undefined;
                return {
                    ...state,
                    clipboard: {
                        ...queuedNotification,
                        open: true,
                    },
                };
            });
        }
    };

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


    handleExited = () => {
        this.processNotificationQueue();
    };

    addNotification = (inputValue, text) => {
        copy(inputValue);
        this.queuedNotification = {
            inputValue,
            text,
        };

        if (this.state.clipboard.open) {
            // immediately begin dismissing current message
            // to start showing new one
            this.setState(state => ({
                ...state,
                clipboard: {
                    ...state.clipboard,
                    open: false,
                },
            }));
        }
        else {
            this.processNotificationQueue();
        }
    };

    // End of notifications methods

    filterUp = (o) => {
        const {
            setSearchState, selectedItem, model,
        } = this.props;

        const newSelectedItem = [
            ...selectedItem,
            {
                parent: model,
                child: `name:${encodeURIComponent(o)}`,
                isLogic: false,
                uuid: uuidv4(),
            }];

        setSearchState({
            isParent: true,
            key: '',
            selectedItem: newSelectedItem,
            item: encodeURIComponent(o),
            toUpdate: true,
        });
    };

    downloadFile = (o) => {
        // we need to act as a proxy as we need to pass the version for downloading the file

        const {
            downloadItem, item, results, download: {address, filename},
        } = this.props;

        // item can be empty if we download from list with no expand on item
        const object = item && !isEmpty(item) ? item : flatten(results).find(x => x.key === o);

        const url = object ? address.reduce((p, c) => p[c], object) : '';

        downloadItem({url, filename});
    };

    render() {
        const {
            selected, actions, model, download,
            List, Detail, addNotification,
        } = this.props;

        const {clipboard: {open, text, inputValue}} = this.state;

        const leftPanelContent = (
            <List
                model={model}
                actions={actions}
                filterUp={this.filterUp}
                downloadFile={this.downloadFile}
                addNotification={this.addNotification}
                download={download}
            />
        );

        const rightPanelContent = selected && (
            <Detail
                model={model}
                actions={actions}
                filterUp={this.filterUp}
                downloadFile={this.downloadFile}
                addNotification={this.addNotification}
            />
        );

        return (
            <Fragment>
                <TwoPanelLayout
                    leftPanelContent={leftPanelContent}
                    rightPanelContent={rightPanelContent}
                />
                <Snackbar
                    anchorOrigin={anchorOrigin}
                    open={open}
                    onClose={this.handleClose}
                    onExited={this.handleExited}
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
            </Fragment>
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
    addNotification: noop,
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
    addNotification: PropTypes.func,
};

const OwkestraCheck = () => <Check color={darkSkyBlue} />;

const BaseWithAddNotification = withAddNotification(Base, IS_OWKESTRA ? OwkestraCheck : Check);

export default BaseWithAddNotification;
