import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import styled from '@emotion/styled';

import {spacingNormal, spacingSmall, spacingExtraSmall} from '../../../../../../../assets/css/variables/spacing';
import {blueGrey, slate} from '../../../../../../../assets/css/variables/colors';
import {fontNormal} from '../../../../../../../assets/css/variables/font';

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
    overflow: hidden;
`;

export const MetadataTag = styled('div')`
    display: inline-block;
    font-size: ${fontNormal};
    border-radius: ${spacingSmall};
    padding: 0 ${spacingExtraSmall};
    border: 1px solid ${slate};
`;
