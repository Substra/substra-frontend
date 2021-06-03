/** @jsx jsx */
import styled from '@emotion/styled';
import { Colors, Spaces } from '@/assets/theme';

const PageTitle = styled.div`
    display: inline-block;
    color: ${Colors.primary};
    font-weight: bold;
    font-size: 14px;
    border: 1px solid ${Colors.border};
    border-bottom-color: white;
    border-radius: ${Spaces.medium} ${Spaces.medium} 0 0;
    padding: ${Spaces.medium} ${Spaces.xxl} ${Spaces.small} ${Spaces.xxl};
    background-color: white;
    margin-bottom: -1px;
`;

export default PageTitle;
