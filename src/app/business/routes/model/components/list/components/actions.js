import React from 'react';
import PropTypes from 'prop-types';
import BaseActions from '../../../../../common/components/list/components/actions';
import PopoverItems from './popoverItems';

class SingleModelActions extends BaseActions {
    filterUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {filterUp, item: {traintuple: {key}}} = this.props;

        filterUp(key);

        this.togglePopover();
    };

    addNotification = (value, message) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {addNotification} = this.props;

        addNotification(value, message);
        this.togglePopover();
    };
}

const Actions = ({item, ...props}) => (!item.traintuple.tag && (
    <SingleModelActions
        item={item}
        PopoverItems={PopoverItems}
        {...props}
    />
));

Actions.propTypes = {
    item: PropTypes.shape(),
};

Actions.defaultProps = {
    item: null,
};

export default Actions;
