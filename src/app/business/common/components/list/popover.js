import React from 'react';
import {capitalize} from 'lodash';
import styled from 'react-emotion';

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

export default ({
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
