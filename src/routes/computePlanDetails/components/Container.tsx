import styled from '@emotion/styled';

import { Spaces } from '@/assets/theme';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex: 1;
    min-height: 100%;
    background-color: white;
    border-radius: 24px;
    padding: ${Spaces.large};
`;

export default Container;
