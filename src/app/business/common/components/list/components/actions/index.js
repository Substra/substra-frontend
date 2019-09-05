import React, {Component} from 'react';
import Popover from 'react-tiny-popover';
import {css} from 'emotion';
import {noop} from 'lodash';

import PropTypes from 'prop-types';
import {MoreVertical, IconButton} from '@substrafoundation/substra-ui';

import {spacingExtraSmall} from '../../../../../../../../assets/css/variables/spacing';
import PopoverItems from '../popoverItems';

const actions = css`
    position: absolute;
    right: ${spacingExtraSmall};
    top: ${spacingExtraSmall};
    
    svg {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
    }
`;

const container = css`z-index: 1000;`;
const noBorder = css`border: none;`;


class Actions extends Component {
    state = {
        isOpen: false,
    };

    togglePopover = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const {isOpen} = this.state;
        this.setState({isOpen: !isOpen});
    };

    filterUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {filterUp, logFilterFromList, item: {name, key}} = this.props;

        filterUp(name);
        logFilterFromList(key);
        this.togglePopover();
    };

    downloadFile = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {downloadFile, logDownloadFromList, item: {key}} = this.props;

        downloadFile(key);
        logDownloadFromList(key);
        this.togglePopover();
    };

    addNotification = text => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {addNotification, logCopyFromList, item: {key}} = this.props;

        addNotification(key, text);
        logCopyFromList(key);
        this.togglePopover();
    };

    popoverContent = () => {
        const {
            PopoverItems, item, model, download,
        } = this.props;
        return (
            <PopoverItems
                model={model}
                download={download}
                filterUp={this.filterUp}
                downloadFile={this.downloadFile}
                addNotification={this.addNotification}
                item={item}
            />
        );
    };

    render() {
        const {isOpen} = this.state;

        return (
            <Popover
                isOpen={isOpen}
                position="bottom"
                containerClassName={container}
                transitionDuration={0}
                content={this.popoverContent()}
                onClickOutside={this.togglePopover}
            >
                <div className={actions}>
                    <IconButton
                        className={noBorder}
                        Icon={MoreVertical}
                        onClick={this.togglePopover}
                        title="Show actions"
                    />
                </div>
            </Popover>
        );
    }
}

Actions.propTypes = {
    item: PropTypes.shape().isRequired,
    model: PropTypes.string.isRequired,
    PopoverItems: PropTypes.func,
    logFilterFromList: PropTypes.func,
    logDownloadFromList: PropTypes.func,
    logCopyFromList: PropTypes.func,
    addNotification: PropTypes.func,
    filterUp: PropTypes.func,
    downloadFile: PropTypes.func,
    download: PropTypes.shape(),
};

Actions.defaultProps = {
    PopoverItems,
    logFilterFromList: noop,
    logDownloadFromList: noop,
    logCopyFromList: noop,
    addNotification: noop,
    filterUp: noop,
    downloadFile: noop,
    download: null,
};

export default Actions;
