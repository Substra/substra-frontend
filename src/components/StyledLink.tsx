import styled from '@emotion/styled';
import { Link } from 'wouter';

import { Colors } from '@/assets/theme';

const StyledLink = styled(Link)`
    color: ${Colors.primary};
    text-decoration: underline;
`;

export default StyledLink;
