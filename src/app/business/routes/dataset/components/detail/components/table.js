import styled from '@emotion/styled';
import {ice, iceBlue} from '../../../../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingSmall} from '../../../../../../../../assets/css/variables/spacing';

export const Table = styled('table')`
    border: 1px solid ${ice};
    border-radius: 3px;
    width: 100%;
    border-collapse: collapse;
`;

export const Tr = styled('tr')`
`;

export const Td = styled('td')`
    padding: ${spacingExtraSmall} ${spacingSmall};
    border-bottom: 1px solid ${ice};
`;

export const Th = styled('th')`
    background-color: ${iceBlue};
    border-bottom: 1px solid ${ice};
    height: 40px;
    text-align: left;
    padding: ${spacingExtraSmall} ${spacingSmall};
`;
