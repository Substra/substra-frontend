import React from 'react';
import PropTypes from 'prop-types';

const FilterUp = ({
                       className, width, height, ...props
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
                               <g stroke="#4B6073">
                                   <path d="M2 7h20M5 12h14M7 17h10" />
                               </g>
                               <circle cx="17" cy="16" r="5" fill="#FFF" stroke="#1DBCC0" />
                               <path stroke="#1DBCC0" strokeLinecap="square" d="M17 13.477V19M14.475 16h5.045" />
                           </g>
                       </svg>
);

FilterUp.defaultProps = {
    className: '',
    width: 24,
    height: 24,
};

FilterUp.propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
};

export default FilterUp;
