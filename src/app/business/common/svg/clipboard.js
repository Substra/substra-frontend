import React from 'react';
import PropTypes from 'prop-types';

const Clipboard = ({
                  className, width, height, color, ...props
              }) => (
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={width}
                      height={height}
                      viewBox="0 0 24 24"
                      className={className}
                      {...props}
                  >
                      <g fill="none" fillRule="evenodd">
                          <path
                              fill={color}
                              d="M17 3h1a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h1a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2zM7 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zm2-2v2h6V3H9z"
                          />
                      </g>
                  </svg>
);

Clipboard.defaultProps = {
    className: '',
    width: 24,
    height: 24,
    color: '#4B6073',
};

Clipboard.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default Clipboard;
