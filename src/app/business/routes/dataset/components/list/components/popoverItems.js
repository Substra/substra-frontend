import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';
import {css} from 'emotion';
import PulseLoader from 'react-spinners/PulseLoader';
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
            {itemLoading && <Action><PulseLoader size={6} /></Action>}
            {!itemLoading && (
                <Fragment>
                    <Action
                        onClick={addNotification('trainDataSampleKeys', 'Train data samples keys successfully copied to clipboard!')}
                    >
                        Copy all train data samples keys to clipboard
                    </Action>
                    <Action
                        onClick={addNotification('testDataSampleKeys', 'Test data samples keys successfully copied to clipboard!')}
                    >
                        Copy all test data samples keys to clipboard
                    </Action>
                </Fragment>
            )}
        </PopItem>
        <DownloadPopItem downloadFile={downloadFile} download={download} />
    </PopList>
);

DatasetPopoverItems.propTypes = {
    ...PopoverItems.propTypes,
    itemLoading: PropTypes.bool,
};

DatasetPopoverItems.defaultProps = {
    ...PopoverItems.defaultProps,
    itemLoading: false,
};

export default DatasetPopoverItems;
