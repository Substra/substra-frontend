import React from 'react';
import PropTypes from 'prop-types';

const ArrowLegend = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" className={className}>
        <g fill="none" fillRule="evenodd" transform="rotate(160 24.333 26.77)">
            <ellipse cx="15.347" cy="10.851" stroke="#4C9BBA" rx="10.891" ry="10.705" />
            <path stroke="#4C9BBA" d="M19.307 12.797l23.07 12.992" />
            <ellipse cx="5.743" cy="40.582" fill="#4C9BBA" fillRule="nonzero" rx="5.644" ry="5.547" />
            <ellipse cx="15.743" cy="10.705" fill="#D9E4ED" fillRule="nonzero" rx="4.059" ry="3.99" />
            <path
                fill="#4C9BBA"
                fillRule="nonzero"
                d="M18.218 13.82l-4.95-6.23c1.782-1.313 4.306-1.07 5.643.682 1.337 1.752 1.04 4.185-.693 5.547z"
            />
            <path stroke="#D9E4ED" d="M44.901 27.93L11.386 38.344" />
            <g transform="rotate(-48.957 49.972 -27.532)">
                <ellipse cx="4.806" cy="5.071" stroke="#4C9BBA" rx="3.366" ry="3.309" />
                <ellipse cx="4.806" cy="5.071" fill="#D9E4ED" fillRule="nonzero" rx="1.584" ry="1.557" />
            </g>
        </g>
    </svg>
);

ArrowLegend.defaultProps = {
    className: '',
};

ArrowLegend.propTypes = {
    className: PropTypes.string,
};

export default ArrowLegend;
