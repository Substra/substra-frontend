import React from 'react';
import PropTypes from 'prop-types';

const Search = ({
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
                              fillRule="nonzero"
                              d="M17.176 15.762l4.531 4.53a1 1 0 0 1-1.414 1.415l-4.531-4.531a8.5 8.5 0 1 1 1.414-1.414zm-2.016-.73a6.5 6.5 0 1 0-.128.128 1.013 1.013 0 0 1 .128-.128z"
                          />
                      </g>
                  </svg>
);

Search.defaultProps = {
    className: '',
    width: 24,
    height: 24,
    color: '#4B6073',
};

Search.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default Search;
