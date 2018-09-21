import React from 'react';
import PropTypes from 'prop-types';

const Check = ({
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
                      <g fill={color} fillRule="evenodd">
                          <path d="M20 11.076a1 1 0 1 1 2 0v.93a11 11 0 1 1-6.523-10.053 1 1 0 1 1-.814 1.827A9 9 0 1 0 20 12.006v-.93zm-9 1.516L21.293 2.3a1 1 0 0 1 1.414 1.414l-11 11a1 1 0 0 1-1.414 0l-3-3A1 1 0 0 1 8.707 10.3L11 12.592z" />
                      </g>
                  </svg>
);

Check.defaultProps = {
    className: '',
    width: 24,
    height: 24,
    color: '#28a745',
};

Check.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default Check;
