import React from 'react';
import PropTypes from 'prop-types';

const Model = ({
                  className, width, height, color, ...props
              }) => (
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={width}
                      height={height}
                      viewBox="0 0 24 22"
                      className={className}
                      {...props}
                  >
                      <g fill="none" fillRule="evenodd" stroke={color} transform="translate(1 1)">
                          <circle cx="11" cy="1.5" r="1.5" fill={color} />
                          <circle cx="11" cy="9.5" r="1.5" fill={color} />
                          <circle cx="11" cy="18.5" r="1.5" fill={color} />
                          <circle cx="20.5" cy="4.5" r="1.5" fill={color} />
                          <circle cx="1.5" cy="4.5" r="1.5" fill={color} />
                          <circle cx="20.5" cy="14.5" r="1.5" fill={color} />
                          <circle cx="1.5" cy="14.5" r="1.5" fill={color} />
                          <path d="M9.746 2.082L2.278 13.147 10 10.183 2.835 5.135l6.42-3.31M12.659 1.826l6.665 3.091-6.665 5.393 6.665 3.305zM2.886 15.514l6.827 3.09h2.626l7.31-3.09" />
                          <path d="M19.734 5.455l-7.351 12.114H9.886L2.45 5.455" />
                      </g>
                  </svg>
);

Model.defaultProps = {
    className: '',
    width: 24,
    height: 22,
    color: '#4B6073',
};

Model.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default Model;
