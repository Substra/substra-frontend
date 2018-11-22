import React from 'react';
import PropTypes from 'prop-types';

const Title = ({o}) => (
    <h4>
        {o.name}
    </h4>
);

Title.propTypes = {
    o: PropTypes.shape({
        name: PropTypes.string,
    }).isRequired,
};

export default Title;
