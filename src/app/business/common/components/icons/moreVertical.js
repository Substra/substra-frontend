import React from 'react';
import PropTypes from 'prop-types';
import {slate} from '../variables/colors';

const MoreVertical = ({
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
                                  <circle cx="12" cy="5" r="2" />
                                  <circle cx="12" cy="13" r="2" />
                                  <circle cx="12" cy="21" r="2" />
                              </g>
                          </svg>
);

MoreVertical.defaultProps = {
    className: '',
    width: 24,
    height: 24,
    color: slate,
};

MoreVertical.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default MoreVertical;
