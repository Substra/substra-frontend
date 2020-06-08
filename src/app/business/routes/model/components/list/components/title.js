import React from 'react';
import PropTypes from 'prop-types';
import {title} from '../../../../../common/components/list/components/title';

export const getTitle = (o) => (o && o.traintuple && o.traintuple.algo ? `${o.traintuple.algo.name}-${o.key.slice(0, 4)}` : '');

const Title = ({o}) => <div className={title} title={getTitle(o)}>{getTitle(o)}</div>;

Title.propTypes = {
    o: PropTypes.shape(),
};

Title.defaultProps = {
    o: null,
};

export default Title;
