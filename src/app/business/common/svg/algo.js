import React from 'react';
import PropTypes from 'prop-types';

const Algo = ({
                  className, width, height, color, ...props
              }) => (
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={width}
                      height={height}
                      viewBox="0 0 50 25"
                      className={className}
                      {...props}
                  >
                      <g fill="none" fillRule="evenodd">
                          <path
                              fill={color}
                              d="M10.414 12l5.293-5.293a1 1 0 1 0-1.414-1.414l-6 6a1 1 0 0 0 0 1.414l6 6a1 1 0 0 0 1.414-1.414L10.414 12z"
                          />
                          <g transform="translate(27)">
                              <path
                                  fill={color}
                                  d="M13.586 12l-5.293 5.293a1 1 0 0 0 1.414 1.414l6-6a1 1 0 0 0 0-1.414l-6-6a1 1 0 0 0-1.414 1.414L13.586 12z"
                              />
                          </g>
                          <g transform="rotate(-70 24.855 -5.297)">
                              <path
                                  fill={color}
                                  d="M1.053 2.237H15.8c.582 0 1.053-.5 1.053-1.119C16.852.501 16.381 0 15.8 0H1.053C.472 0 0 .5 0 1.118c0 .618.472 1.119 1.053 1.119z"
                              />
                          </g>
                      </g>
                  </svg>
);

Algo.defaultProps = {
    className: '',
    width: 45,
    height: 25,
    color: '#000',
};

Algo.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default Algo;
