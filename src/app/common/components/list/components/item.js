import styled from '@emotion/styled';
import {spacingNormal, spacingSmall} from '../../../../../../assets/css/variables/spacing';
import {ice} from '../../../../../../assets/css/variables/colors';

const Item = styled('div')`
    position: relative;
    padding: ${spacingSmall} ${spacingNormal};
    border-bottom: 1px solid ${ice};
    cursor: pointer;
`;

export default Item;
