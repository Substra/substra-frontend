import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';

import {spacingNormal, spacingSmall} from '../../../../../../../assets/css/variables/spacing';
import {blueGrey} from '../../../../../../../assets/css/variables/colors';

const singleMetadata = css`
    margin-right: ${spacingNormal};
`;

const metadataLabel = css`
    text-transform: uppercase;
    margin-right: 8px;
    font-weight: bold;
`;

export const SingleMetadata = ({label, value, children}) => (
    <span className={singleMetadata}>
        <span className={metadataLabel}>{label}</span>
        {value || children}
    </span>
);

SingleMetadata.propTypes = {
    label: PropTypes.string,
    value: PropTypes.node,
    children: PropTypes.node,
};

SingleMetadata.defaultProps = {
    label: '',
    value: '',
    children: null,
};

export const metadata = css`
    display: block;
    vertical-align: top;
    margin-top: ${spacingSmall};
    color: ${blueGrey};
`;
