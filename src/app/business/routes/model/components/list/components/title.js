import React from 'react';
import PropTypes from 'prop-types';

export const getTitle = o => (o && o.algo ? `${o.algo.name}-${o.key.slice(0, 4)}` : '');

const Title = ({o}) => (
    <h4>
        {getTitle(o)}
    </h4>
);

Title.propTypes = {
    o: PropTypes.shape(),
};

Title.defaultProps = {
    o: null,
};

export default Title;
