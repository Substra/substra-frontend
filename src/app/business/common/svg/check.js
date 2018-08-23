import React from 'react';
import PropTypes from 'prop-types';

const Check = ({
                  className, width, height, color, backgroundColor,
              }) => (
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={width}
                      height={width}
                      viewBox="0 0 20 20"
                      className={className}
                  >
                      <g stroke={color} strokeWidth="2.3" fill={backgroundColor}>
                          <circle cx="10" cy="10" r="8.5" strokeWidth="1" />
                          <path d="M5.2,10 8.5,13.4 14.8,7.2" />
                      </g>
                  </svg>
);

Check.defaultProps = {
    className: '',
    width: 30,
    height: 30,
    color: '#28a745',
    backgroundColor: '#fff',
};

Check.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
};

export default Check;
