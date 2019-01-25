import React from 'react';
import PropTypes from 'prop-types';
import {getTitle} from '../../list/components/title';
import {title} from '../../../../../common/components/detail/components/title';

const Title = ({item}) => (<div className={title}>{getTitle(item)}</div>);

Title.propTypes = {
    item: PropTypes.shape(),
};

Title.defaultProps = {
    item: null,
};

export default Title;
