import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {capitalize} from 'lodash';
import {ice, white} from '../../../../../../assets/css/variables/colors';

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
    background-color: ${white};
    border: 1px solid ${ice};
`;

export const PopItem = styled('li')`
    border-bottom: 1px solid #eeeeee;
    font-size: 13px;
`;

export const FilterUpPopItem = ({filterUp}) => (
    <PopItem onClick={filterUp}>
        <Action>
            Add as a filter
        </Action>
    </PopItem>
);

FilterUpPopItem.propTypes = {
    filterUp: PropTypes.func.isRequired,
};

export const CopyPopItem = ({addNotification, model}) => (
    <PopItem>
        <Action onClick={addNotification(`${capitalize(model)}'s key successfully copied to clipboard!`)}>
            {`Copy ${model}'s key to clipboard`}
        </Action>
    </PopItem>
);

CopyPopItem.propTypes = {
    model: PropTypes.string.isRequired,
    addNotification: PropTypes.func.isRequired,
};

export const DownloadPopItem = ({downloadFile, download}) => (
    <PopItem onClick={downloadFile}>
        <Action>
            {download.text}
        </Action>
    </PopItem>
);

DownloadPopItem.propTypes = {
    downloadFile: PropTypes.func.isRequired,
    download: PropTypes.shape().isRequired,
};


const PopoverItems = ({
model, filterUp, addNotification, downloadFile, download,
}) => (
    <PopList>
        <FilterUpPopItem filterUp={filterUp} />
        <CopyPopItem model={model} addNotification={addNotification} />
        <DownloadPopItem downloadFile={downloadFile} download={download} />
    </PopList>
);

PopoverItems.propTypes = {
    model: PropTypes.string.isRequired,
    filterUp: PropTypes.func.isRequired,
    addNotification: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    download: PropTypes.shape().isRequired,
};

export default PopoverItems;
