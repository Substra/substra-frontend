import React from 'react';
import PropTypes from 'prop-types';
import {slate} from '../variables/colors';

const Book = ({
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
                      <path
                          fill={color}
                          fillRule="nonzero"
                          d="M19 16V3H6.5A1.5 1.5 0 0 0 5 4.5v11.837A3.486 3.486 0 0 1 6.5 16H19zm0 2H6.5a1.5 1.5 0 0 0 0 3H19v-3zM6.5 1H20a1 1 0 0 1 1 1v20a1 1 0 0 1-1 1H6.5A3.5 3.5 0 0 1 3 19.5v-15A3.5 3.5 0 0 1 6.5 1z"
                      />
                  </svg>
);

Book.defaultProps = {
    className: '',
    width: 24,
    height: 24,
    color: slate,
};

Book.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default Book;
