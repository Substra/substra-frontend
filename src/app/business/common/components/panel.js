import styled from '@emotion/styled';
import {ice, white} from '../../../../../assets/css/variables/colors';
import {spacingNormal} from '../../../../../assets/css/variables/spacing';

export const PanelWrapper = styled('div')`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
`;

export const PanelTop = styled('div')`
    background-color: ${white};
    border-bottom: 1px solid ${ice};
    padding: 0 ${spacingNormal};
    height: 40px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    flex-grow: 0;
`;

export const PanelContent = styled('div')`
    overflow: auto;
    flex-grow: 1;
`;
