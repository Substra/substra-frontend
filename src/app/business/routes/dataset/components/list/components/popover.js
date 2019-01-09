import React from 'react';
import {capitalize} from 'lodash';
import {css} from 'emotion';

import {PulseLoader} from 'react-spinners';
import Popover from '@material-ui/core/Popover/Popover';

import PropTypes from 'prop-types';
import {coolBlue} from '../../../../../../../../assets/css/variables';
import {Action, PopItem, PopList} from '../../../../../common/components/list/components/popover';

const popSubItem = css`
    span {
        padding: 5px 15px;
    }
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
open, anchorEl, model, download, itemLoading, filterUp, downloadFile, addNotification, popoverHandleClose,
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
            <PopItem className={popSubItem}>
                <Action
                    onClick={addNotification('key', `${capitalize(model)}'s key successfully copied to clipboard!`)}
                >
                    {`Copy ${model}'s key to clipboard`}
                </Action>
                {itemLoading && <PulseLoader size={6} color={coolBlue} />}
                {!itemLoading
                && (
                    <Action
                        onClick={addNotification('trainDataKeys', 'Datas\'s key successfully copied to clipboard!')}
                    >
                        Copy all datas' key to clipboard
                    </Action>
                )
                }
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
