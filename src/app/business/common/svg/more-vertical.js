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
                           <g fill={color} fillRule="evenodd">
                               <circle cx="12" cy="5" r="2" />
                               <circle cx="12" cy="13" r="2" />
                               <circle cx="12" cy="21" r="2" />
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
