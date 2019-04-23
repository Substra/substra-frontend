import styled from '@emotion/styled';

import {secondaryAccent, iceSecondaryAccent} from '../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingNormal, spacingSmall} from '../../../../../assets/css/variables/spacing';

export const AlertWrapper = styled('div')`
    background-color: ${iceSecondaryAccent};
    border: 1px solid ${secondaryAccent};
    border-radius: 3px;
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: ${spacingNormal} 0;
    flex-wrap: wrap;
`;

export const AlertTitle = styled('div')`
    color: ${secondaryAccent};
    font-weight: bold;
    margin: ${spacingSmall};
`;

export const AlertActions = styled('div')`
    margin: ${spacingExtraSmall} ${spacingExtraSmall} ${spacingExtraSmall} ${spacingSmall};
`;

export const AlertInlineButton = styled('button')`
    border: none;
    background: none;
    color: ${secondaryAccent};
    text-decoration: underline;
    cursor: pointer;
    padding: ${spacingExtraSmall};
`;
