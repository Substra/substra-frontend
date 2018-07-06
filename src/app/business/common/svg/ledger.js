import React from 'react';
import PropTypes from 'prop-types';

const Ledger = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="312" height="324" viewBox="0 0 312 324" className={className}>
        <g fill="none" fillRule="evenodd">
            <path
                stroke="#1DBCC0"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M142.86 60.995a31.288 31.288 0 0 0 14.068 3.318 31.29 31.29 0 0 0 13.87-3.22l94.966 201.585c-10.576 5.023-17.893 15.78-17.924 28.249H64.16c-.03-12.492-7.376-23.266-17.984-28.277l96.683-201.655z"
            />
            <g fill="#EDC20F" fillRule="nonzero" opacity=".104" transform="translate(1 1)">
                <ellipse cx="155.928" cy="31.965" rx="31.387" ry="31.348" />
                <ellipse cx="31.773" cy="290.004" rx="31.387" ry="31.348" />
                <ellipse cx="278.227" cy="290.004" rx="31.387" ry="31.348" />
            </g>
            <g
                fillRule="nonzero"
                stroke="#1DBCC0"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                transform="translate(1 1)"
            >
                <ellipse cx="155.928" cy="31.965" rx="31.387" ry="31.348" />
                <ellipse cx="31.773" cy="290.004" rx="31.387" ry="31.348" />
                <ellipse cx="278.227" cy="290.004" rx="31.387" ry="31.348" />
            </g>
        </g>
    </svg>
);

Ledger.defaultProps = {
    className: '',
};

Ledger.propTypes = {
    className: PropTypes.string,
};

export default Ledger;
