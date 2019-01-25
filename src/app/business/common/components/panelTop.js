import styled from '@emotion/styled';
import {ice, white} from '../../../../../assets/css/variables/colors';
import {spacingNormal} from '../../../../../assets/css/variables/spacing';

export default styled('div')`
    background-color: ${white};
    border-bottom: 1px solid ${ice};
    padding: 0 ${spacingNormal};
    height: 40px;
    display: flex;
    align-items: center;
`;
