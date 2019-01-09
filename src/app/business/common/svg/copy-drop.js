import React from 'react';
import PropTypes from 'prop-types';

const CopyDrop = ({
                       className, width, height, color, ...props
                   }) => (
                       <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" className={className} {...props}>
                           <g fill="none" fillRule="evenodd">
                               <g transform="translate(5.009)">
                                   <mask id="copydrop-b" fill="#fff">
                                       <path d="M10.5 3.679v2.988h2.69L10.5 3.679zm3.75 4.654h-4.5C9.336 8.333 9 7.96 9 7.5v-5H4.5c-.414 0-.75.373-.75.833v13.334c0 .46.336.833.75.833h9c.414 0 .75-.373.75-.833V8.333zm-4.5-7.5c.199 0 .39.088.53.244l5.25 5.834c.141.156.22.368.22.589v9.167c0 1.38-1.007 2.5-2.25 2.5h-9c-1.243 0-2.25-1.12-2.25-2.5V3.333c0-1.38 1.007-2.5 2.25-2.5h5.25z" />
                                   </mask>
                                   <path fill="#000" fillRule="nonzero" d="M10.5 3.679v2.988h2.69L10.5 3.679zm3.75 4.654h-4.5C9.336 8.333 9 7.96 9 7.5v-5H4.5c-.414 0-.75.373-.75.833v13.334c0 .46.336.833.75.833h9c.414 0 .75-.373.75-.833V8.333zm-4.5-7.5c.199 0 .39.088.53.244l5.25 5.834c.141.156.22.368.22.589v9.167c0 1.38-1.007 2.5-2.25 2.5h-9c-1.243 0-2.25-1.12-2.25-2.5V3.333c0-1.38 1.007-2.5 2.25-2.5h5.25z" />
                                   <g fill={color} mask="url(#copydrop-b)">
                                       <path d="M0 0h18v20H0z" />
                                   </g>
                               </g>
                               <g transform="translate(0 4.444)">
                                   <mask id="copydrop-d" fill="#fff">
                                       <path d="M10.5 3.679v2.988h2.69L10.5 3.679zm3.75 4.654h-4.5C9.336 8.333 9 7.96 9 7.5v-5H4.5c-.414 0-.75.373-.75.833v13.334c0 .46.336.833.75.833h9c.414 0 .75-.373.75-.833V8.333zm-4.5-7.5c.199 0 .39.088.53.244l5.25 5.834c.141.156.22.368.22.589v9.167c0 1.38-1.007 2.5-2.25 2.5h-9c-1.243 0-2.25-1.12-2.25-2.5V3.333c0-1.38 1.007-2.5 2.25-2.5h5.25z" />
                                   </mask>
                                   <path fill="#000" fillRule="nonzero" d="M10.5 3.679v2.988h2.69L10.5 3.679zm3.75 4.654h-4.5C9.336 8.333 9 7.96 9 7.5v-5H4.5c-.414 0-.75.373-.75.833v13.334c0 .46.336.833.75.833h9c.414 0 .75-.373.75-.833V8.333zm-4.5-7.5c.199 0 .39.088.53.244l5.25 5.834c.141.156.22.368.22.589v9.167c0 1.38-1.007 2.5-2.25 2.5h-9c-1.243 0-2.25-1.12-2.25-2.5V3.333c0-1.38 1.007-2.5 2.25-2.5h5.25z" />
                                   <g fill={color} mask="url(#copydrop-d)">
                                       <path d="M0 0h18v20H0z" />
                                   </g>
                               </g>
                               <path fill={color} d="M14.191 7.111h5.843v10.667h-5.843z" />
                               <path fill={color} d="M9.183 1.778h5.843V8H9.183z" />
                               <path fill={color} d="M8.348 1.778h5.843v4.444H8.348z" />
                               <path fill="#FFF" d="M6.42 12.444h7.847v7.111H6.42z" />
                               <path fill="#FFF" d="M5.936 6.93h3.339v7.111H5.936z" />
                               <path fill={color} d="M15.448 6.743l-.743 4.285-3.542-3.542zM20.657 6.971l-.114 3.657L17 7.086z" />
                               <g transform="translate(13 14)">
                                   <rect width="9.3" height="9.3" x=".35" y=".35" fill="#FFF" stroke="#1DBCC0" strokeWidth=".7" rx="2" />
                                   <path fill="#1DBCC0" d="M4.9 8.313L1.75 2.7h6.3z" />
                               </g>
                           </g>
                       </svg>
);

CopyDrop.defaultProps = {
    className: '',
    width: 24,
    height: 24,
    color: '#4B6073',
};

CopyDrop.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default CopyDrop;
