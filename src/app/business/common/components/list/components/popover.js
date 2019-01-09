import React from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';
import styled from '@emotion/styled';
import Popover from '@material-ui/core/Popover/Popover';

export const Action = styled('span')`
    display: block;
    padding: 10px 15px;
    cursor: pointer;
    
    &:hover {
        background-color: #f0f0ef;
    }
`;

export const PopList = styled('div')`
    list-style: none;
    margin: 0;
`;

export const PopItem = styled('li')`
    border-bottom: 1px solid #eeeeee;
    font-size: 13px;   
`;

const anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'left',
};

const transformOrigin = {
    vertical: 'top',
    horizontal: 'left',
};

const ActionsPopover = ({
open, anchorEl, model, download, filterUp, downloadFile, addNotification, popoverHandleClose,
}) => (
    <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={popoverHandleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
    >
        <PopList>
            <PopItem onClick={filterUp}>
                <Action>
                    Add as a filter
                </Action>
            </PopItem>
            <PopItem>
                <Action onClick={addNotification(`${capitalize(model)}'s key successfully copied to clipboard!`)}>
                    {`Copy ${model}'s key to clipboard`}
                </Action>
            </PopItem>
            <PopItem onClick={downloadFile}>
                <Action>
                    {download.text}
                </Action>
            </PopItem>
        </PopList>
    </Popover>
);

ActionsPopover.propTypes = {
    ...Popover.propTypes,
    filterUp: PropTypes.func.isRequired,
    popoverHandleClose: PropTypes.func.isRequired,
    addNotification: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    model: PropTypes.string.isRequired,
    download: PropTypes.shape().isRequired,
};

export default ActionsPopover;
