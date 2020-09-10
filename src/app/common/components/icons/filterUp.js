import React from 'react';
import PropTypes from 'prop-types';
import {slate, tealish} from '../../../../../assets/css/variables/colors';

const FilterUp = ({
                      className, width, height, color, secondaryColor, ...props
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
                              <path d="M0 0h24v24H0z" />
                              <g stroke={color}>
                                  <path d="M2 7h20M5 12h14M7 17h10" />
                              </g>
                              <circle cx="17" cy="16" r="5" fill="#FFF" stroke={secondaryColor} />
                              <path stroke={secondaryColor} strokeLinecap="square" d="M17 13.477V19M14.475 16h5.045" />
                          </g>
                      </svg>
);

FilterUp.defaultProps = {
    color: slate,
    secondaryColor: tealish,
    className: '',
    width: 24,
    height: 24,
};

FilterUp.propTypes = {
    color: PropTypes.string,
    secondaryColor: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
};

export default FilterUp;
