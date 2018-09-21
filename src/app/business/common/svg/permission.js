import React from 'react';
import PropTypes from 'prop-types';

const Permission = ({
                        className, width, height, color, ...props
                    }) => (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={width}
                            height={height}
                            viewBox="0 0 8 9"
                            className={className}
                            {...props}
                        >
                            <g fill={color} fillRule="evenodd">
                                <path
                                    fillRule="nonzero"
                                    d="M.05 7.899L3.56.296C3.646.12 3.76 0 3.971 0h.02c.212 0 .332.12.41.296l3.498 7.581c.035.071.049.127.049.19a.286.286 0 0 1-.296.283H.282C.127 8.35 0 8.23 0 8.09c.007-.05.014-.12.05-.191zm7.186-.106L3.97.69.72 7.793h6.516z"
                                />
                                <path stroke="#4C9BBA" d="M3.962 1.2L7 7.82H.923z" />
                            </g>
                        </svg>
);

Permission.defaultProps = {
    className: '',
    width: 8,
    height: 9,
    color: '#4C9BBA',
};

Permission.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default Permission;
