import styled from '@emotion/styled';

import {darkSkyBlue, iceBlueTwo} from '../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingNormal, spacingSmall} from '../../../../../assets/css/variables/spacing';

export const AlertWrapper = styled('div')`
    background-color: ${iceBlueTwo};
    border: 1px solid ${darkSkyBlue};
    border-radius: 3px;
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: ${spacingNormal} 0;
    flex-wrap: wrap;
`;

export const AlertTitle = styled('div')`
    color: ${darkSkyBlue};
    font-weight: bold;
    margin: ${spacingSmall};
`;

export const AlertActions = styled('div')`
    margin: ${spacingExtraSmall} ${spacingExtraSmall} ${spacingExtraSmall} ${spacingSmall};
`;

export const AlertInlineButton = styled('button')`
    border: none;
    background: none;
    color: ${darkSkyBlue};
    text-decoration: underline;
    cursor: pointer;
    padding: ${spacingExtraSmall};
`;
