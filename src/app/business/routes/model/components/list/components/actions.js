import React from 'react';
import PropTypes from 'prop-types';
import BaseActions from '../../../../../common/components/list/components/actions';

const Actions = ({item, ...props}) => (!item.tag && <BaseActions item={item} {...props} />);

Actions.propTypes = {
    item: PropTypes.shape(),
};

Actions.defaultProps = {
    item: null,
};

export default Actions;
