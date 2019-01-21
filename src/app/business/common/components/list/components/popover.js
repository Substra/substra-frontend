import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover/Popover';


const anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'left',
};

const transformOrigin = {
    vertical: 'top',
    horizontal: 'left',
};

const ActionsPopover = ({
    open, anchorEl, popoverHandleClose, children,
}) => (
    <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={popoverHandleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
    >
        {children}
    </Popover>
);

ActionsPopover.propTypes = {
    ...Popover.propTypes,
    popoverHandleClose: PropTypes.func.isRequired,
    children: PropTypes.node,
};

ActionsPopover.defaultProps = {
    children: null,
};

export default ActionsPopover;
