import React from 'react';
import PropTypes from 'prop-types';
import BaseActions from '../../../../../common/components/list/components/actions';
import PopoverItems from './popoverItems';
import {withActionsAnalytics} from '../../../../../common/components/list/components/actions/analytics';

class SingleModelActions extends BaseActions {
    filterUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {filterUp, logFilterFromList, item: {traintuple: {outModel: {hash}}}} = this.props;

        filterUp(hash);
        logFilterFromList(hash);

        this.togglePopover();
    };

    addNotification = (value, message) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {addNotification, logCopyFromList} = this.props;

        addNotification(value, message);
        logCopyFromList(value);
        this.togglePopover();
    };
}

const Actions = ({item, ...props}) => (!item.tag && (
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

export default withActionsAnalytics(Actions);
