import styled from '@emotion/styled';
import {spacingExtraSmall} from '../../../../../../../assets/css/variables/spacing';

export default styled('div')`
    position: absolute;
    right: ${spacingExtraSmall};
    top: ${spacingExtraSmall};
    
    svg {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
    }
`;
