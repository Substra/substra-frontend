import React from 'react';
import PropTypes from 'prop-types';

const ArrowUp = ({className, color}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" className={className}>
        <path
            fill={color}
            fillRule="evenodd"
            d="M24.763 26.15L13.585 2.323 2.455 26.149h22.308zM.16 26.503L12.178.984C12.46.395 12.862 0 13.585 0h.08c.724 0 1.126.394 1.407.985l11.978 25.44c.12.236.16.433.16.63 0 .512-.442.945-1.004.945H.965C.442 28 0 27.606 0 27.134c0-.158.04-.394.16-.63z"
        />
    </svg>
);

ArrowUp.defaultProps = {
    className: '',
    color: '#1DBCC0',
};

ArrowUp.propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
};

export default ArrowUp;
