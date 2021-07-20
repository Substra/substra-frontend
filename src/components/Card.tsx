import styled from '@emotion/styled';

import { Colors } from '@/assets/theme';

const Card = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    border: 1px solid ${Colors.border};
    box-shadow: 0 0 8px -2px ${Colors.veryLightContent};
    justify-content: start;
    background-color: white;
`;

export default Card;
