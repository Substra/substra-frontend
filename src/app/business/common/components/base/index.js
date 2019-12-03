import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {flatten, isEmpty, noop} from 'lodash';
import uuidv4 from 'uuid/v4';
import {Check, TwoPanelLayout, withAddNotification} from '@substrafoundation/substra-ui';

import List from '../list/redux';
import Detail from '../detail/redux';

export const margin = 40;


export class BaseComponent extends Component {
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

    getLeftPanelContent = () => {
        const {
            actions, model, download,
            List, addNotification,
        } = this.props;

        return (
            <List
                model={model}
                actions={actions}
                filterUp={this.filterUp}
                downloadFile={this.downloadFile}
                addNotification={addNotification}
                download={download}
            />
        );
    };

    getRightPanelContent = () => {
        const {
            actions, model, selected,
            Detail, addNotification,
        } = this.props;

        return selected && (
            <Detail
                model={model}
                actions={actions}
                filterUp={this.filterUp}
                downloadFile={this.downloadFile}
                addNotification={addNotification}
            />
            );
    };

    render() {
        return (
            <TwoPanelLayout
                leftPanelContent={this.getLeftPanelContent()}
                rightPanelContent={this.getRightPanelContent()}
            />
        );
    }
}

BaseComponent.defaultProps = {
    selected: null,
    selectedItem: [],
    item: null,
    addNotification: noop,
    setSearchState: noop,
    downloadItem: noop,
    download: {},
    results: [],
    List,
    Detail,
};

BaseComponent.propTypes = {
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
    addNotification: PropTypes.func,
    setSearchState: PropTypes.func,
    downloadItem: PropTypes.func,
    List: PropTypes.elementType,
    Detail: PropTypes.elementType,
};

const BaseWithAddNotification = withAddNotification(BaseComponent, Check);

export default BaseWithAddNotification;
