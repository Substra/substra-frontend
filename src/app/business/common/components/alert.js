import styled from '@emotion/styled';

import {gold, iceGold} from '../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingNormal, spacingSmall} from '../../../../../assets/css/variables/spacing';

export const alertWrapper = `
    background-color: ${iceGold};
    border: 1px solid ${gold};
    border-radius: 3px;
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: ${spacingNormal} 0;
    flex-wrap: wrap;
`;

export const alertTitle = `
    color: ${gold};
    font-weight: bold;
    margin: ${spacingSmall};
`;

export const AlertActions = styled('div')`
    margin: ${spacingExtraSmall} ${spacingExtraSmall} ${spacingExtraSmall} ${spacingSmall};
`;

export const alertInlineButton = `
    border: none;
    background: none;
    color: ${gold};
    text-decoration: underline;
    cursor: pointer;
    padding: ${spacingExtraSmall};
`;
