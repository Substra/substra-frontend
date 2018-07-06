import React from 'react';
import PropTypes from 'prop-types';

const LedgerLegend = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" className={className}>
        <g fill="none" fillRule="evenodd" stroke="#1DBCC0" strokeLinejoin="round" transform="translate(1.418 .5)">
            <path d="M4.17 44.83L23.63 4.203 42.744 44.83z" />
            <circle cx="42.259" cy="44.102" r="4.767" fill="#FFF" fillRule="nonzero" strokeLinecap="round" />
            <circle cx="4.826" cy="44.102" r="4.767" fill="#FFF" fillRule="nonzero" strokeLinecap="round" />
            <circle cx="23.683" cy="4.861" r="4.767" fill="#FFF" fillRule="nonzero" strokeLinecap="round" />
        </g>
    </svg>
);

LedgerLegend.defaultProps = {
    className: '',
};

LedgerLegend.propTypes = {
    className: PropTypes.string,
};

export default LedgerLegend;
