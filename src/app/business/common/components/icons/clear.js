import React from 'react';
import PropTypes from 'prop-types';
import {slate} from '../variables/colors';

const ClearIcon = ({
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
                           <g fill="none" fillRule="evenodd">
                               <mask id="delete-b" fill="#fff">
                                   <path
                                       d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                                   />
                               </mask>
                               <g fill={color} mask="url(#delete-b)">
                                   <path d="M0 0h24v24H0z" />
                               </g>
                           </g>
                       </svg>
);

ClearIcon.defaultProps = {
    className: '',
    width: 24,
    height: 24,
    color: slate,
};

ClearIcon.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};

export default ClearIcon;
