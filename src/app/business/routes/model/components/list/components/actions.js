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
