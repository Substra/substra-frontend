import React from 'react';
import styled from '@emotion/styled';
import PulseLoader from 'react-spinners/PulseLoader';
import {ice, white} from '../../../../assets/css/variables/colors';
import {spacingLarge, spacingNormal} from '../../../../assets/css/variables/spacing';

const PulseLoaderWrapper = styled('div')`
    border: 1px solid ${ice};
    background-color: ${white};
    padding: ${spacingNormal};
    margin: 0 ${spacingLarge};
`;

export default () => (
    <PulseLoaderWrapper>
        <PulseLoader size={6} />
    </PulseLoaderWrapper>
);
