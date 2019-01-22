import React from 'react';
import {capitalize} from 'lodash';
import {css} from 'emotion';
import {PulseLoader} from 'react-spinners';
import PopoverItems, {
PopList, FilterUpPopItem, DownloadPopItem, PopItem, Action,
} from '../../../../../common/components/list/components/popoverItems';

const popSubItem = css`
    span {
        padding: 5px 15px;
    }
`;

const DatasetPopoverItems = ({
model, filterUp, addNotification, downloadFile, download, itemLoading,
}) => (
    <PopList>
        <FilterUpPopItem filterUp={filterUp} />
        <PopItem className={popSubItem}>
            <Action
                onClick={addNotification('key', `${capitalize(model)}'s key successfully copied to clipboard!`)}
            >
                {`Copy ${model}'s key to clipboard`}
            </Action>
            {itemLoading && <PulseLoader size={6} />}
            {!itemLoading && (
            <Action
                onClick={addNotification('trainDataKeys', 'Datas\'s key successfully copied to clipboard!')}
            >
                Copy all datas' key to clipboard
            </Action>
            )}
        </PopItem>
        <DownloadPopItem downloadFile={downloadFile} download={download} />
    </PopList>
);

DatasetPopoverItems.propTypes = PopoverItems.propTypes;
DatasetPopoverItems.defaultProps = PopoverItems.defaultProps;

export default DatasetPopoverItems;
