import React from 'react';
import PropTypes from 'prop-types';

const Title = ({o}) => (
    <h4>
        {o && o.name}
    </h4>
);

Title.propTypes = {
    o: PropTypes.shape({
        name: PropTypes.string,
    }),
};

Title.defaultProps = {
    o: null,
};

export default Title;
