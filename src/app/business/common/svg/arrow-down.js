import React from 'react';
import PropTypes from 'prop-types';

const ArrowDown = ({color, className}) =>
    (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" className={className}>
        <path
            fill={color}
            fillRule="evenodd"
            d="M2.448 1.85l11.177 23.826 11.13-23.825H2.448zm24.602-.354l-12.018 25.52c-.281.59-.683.984-1.407.984h-.08c-.724 0-1.125-.394-1.407-.985L.161 1.575A1.332 1.332 0 0 1 0 .945C0 .433.442 0 1.005 0h25.24c.524 0 .965.394.965.866 0 .158-.04.394-.16.63z"
        />
    </svg>);

ArrowDown.defaultProps = {
    className: '',
    color: '#1DBCC0',
};

ArrowDown.propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
};

export default ArrowDown;
