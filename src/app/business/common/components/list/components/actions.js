import styled from '@emotion/styled';
import {spacingNormal, spacingSmall} from '../../../../../../../assets/css/variables/spacing';

export default styled('div')`
    position: absolute;
    right: ${spacingNormal};
    top: ${spacingSmall};
    
    svg {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
    }
`;
