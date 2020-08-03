import React, {Component} from 'react';
import Popover from 'react-tiny-popover';
import {css} from 'emotion';
import {noop} from 'lodash';

import PropTypes from 'prop-types';

import {spacingExtraSmall} from '../../../../../../../assets/css/variables/spacing';
import PopoverItems from './popoverItems';
import {IconButton} from '../../iconButton';
import {MoreVertical} from '../../icons';

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

        const {filterUp, item: {name}} = this.props;

        filterUp(name);
        this.togglePopover();
    };

    downloadFile = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {downloadFile, item: {key}} = this.props;

        downloadFile(key);
        this.togglePopover();
    };

    addNotification = (text) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {addNotification, item: {key}} = this.props;

        addNotification(key, text);
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
    addNotification: PropTypes.func,
    filterUp: PropTypes.func,
    downloadFile: PropTypes.func,
    download: PropTypes.shape(),
};

Actions.defaultProps = {
    PopoverItems,
    addNotification: noop,
    filterUp: noop,
    downloadFile: noop,
    download: null,
};

export default Actions;
