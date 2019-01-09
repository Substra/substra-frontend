import React from 'react';
import PropTypes from 'prop-types';

const DownloadDrop = ({
                       className, width, height, color, ...props
                   }) => (
                       <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" className={className} {...props}>
                           <g fill="none" fillRule="evenodd">
                               <mask id="downloaddrop-b" fill="#fff">
                                   <path d="M11 13.586V2a1 1 0 0 1 2 0v11.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L11 13.586zM2 17a1 1 0 0 1 2 0v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 1 2 0v3a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3z" />
                               </mask>
                               <path fill="#000" fillRule="nonzero" d="M11 13.586V2a1 1 0 0 1 2 0v11.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L11 13.586zM2 17a1 1 0 0 1 2 0v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 1 2 0v3a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3z" />
                               <g fill={color} mask="url(#downloaddrop-b)">
                                   <path d="M0 0h24v24H0z" />
                               </g>
                               <g transform="translate(13 14)">
                                   <rect width="9.3" height="9.3" x=".35" y=".35" fill="#FFF" stroke="#1DBCC0" strokeWidth=".7" rx="2" />
                                   <path fill="#1DBCC0" d="M4.9 8.313L1.75 2.7h6.3z" />
                               </g>
                           </g>
                       </svg>
);

DownloadDrop.defaultProps = {
    className: '',
    width: 24,
    height: 24,
    color: '#4B6073',
};

DownloadDrop.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default DownloadDrop;
