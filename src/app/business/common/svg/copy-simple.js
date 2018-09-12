import React from 'react';
import PropTypes from 'prop-types';

const CopySimple = ({
                       className, width, height, color, ...props
                   }) => (
                       <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 28 29" className={className} {...props}>
                           <g fill="none" fillRule="evenodd">
                               <g transform="translate(6)">
                                   <mask id="mask-copy" fill="#fff">
                                       <path d="M19 10h-6a1 1 0 0 1-1-1V3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10h1a1 1 0 0 0 1-1v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h7a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 .217.324zm-5-5.586V8h3.586L14 4.414z" />
                                   </mask>
                                   <g fill={color} mask="url(#mask-copy)">
                                       <path d="M0 0h24v24H0z" />
                                   </g>
                               </g>
                               <g transform="translate(-1 6)">
                                   <g fill={color}>
                                       <path d="M19 10h-6a1 1 0 0 1-1-1V3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10h1a1 1 0 0 0 1-1v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h7a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 .217.324zm-5-5.586V8h3.586L14 4.414z" />
                                   </g>
                               </g>
                               <path fill={color} d="M18 9h8v13h-8z" />
                               <path fill={color} d="M11 2h8v8h-8z" />
                               <path fill={color} d="M10 3h8v6h-8z" />
                               <path fill="#FFF" d="M8 16h10v9H8z" />
                               <path fill="#FFF" d="M7 9h4v9H7z" />
                               <path fill={color} d="M18.914 8.586l-.353 5.303-4.95-4.95zM26.99 8.675l.06 4.889-4.95-4.95z" />
                           </g>
                       </svg>
);

CopySimple.defaultProps = {
    className: '',
    width: 28,
    height: 29,
    color: '#4B6073',
};

CopySimple.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default CopySimple;
