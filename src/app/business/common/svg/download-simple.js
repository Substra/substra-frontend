import React from 'react';
import PropTypes from 'prop-types';

const DownloadSimple = ({
                       className, width, height, color, ...props
                   }) => (
                       <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width={width}
                           height={height}
                           className={className}
                           {...props}
                           viewBox="0 0 24 24"
                       >
                           <g fill="none" fillRule="evenodd">

                               <path
                                   fill={color}
                                   fillRule="nonzero"
                                   d="M11 13.586V2a1 1 0 0 1 2 0v11.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L11 13.586zM2 17a1 1 0 0 1 2 0v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 1 2 0v3a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3z"
                               />
                               <mask fill="#fff">
                                   <path
                                       fill={color}
                                       fillRule="nonzero"
                                       d="M11 13.586V2a1 1 0 0 1 2 0v11.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L11 13.586zM2 17a1 1 0 0 1 2 0v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 1 2 0v3a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3z"
                                   />
                                   <path d="M0 0h24v24H0z" />
                               </mask>
                           </g>
                       </svg>
);

DownloadSimple.defaultProps = {
    className: '',
    width: 24,
    height: 24,
    color: '#4B6073',
};

DownloadSimple.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default DownloadSimple;
