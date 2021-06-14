import styled from '@emotion/styled';

import { Fonts, Colors } from '@/assets/theme';

export const H1 = styled.h1`
    font-size: ${Fonts.sizes.h1};
    font-weight: ${Fonts.weights.heavy};
    color: ${Colors.content};
`;

export const H2 = styled.h2`
    font-size: ${Fonts.sizes.h2};
    font-weight: ${Fonts.weights.normal};
    color: ${Colors.content};
`;

export const BodySmall = styled.p`
    font-size: ${Fonts.sizes.smallBody};
    font-weight: ${Fonts.weights.normal};
    color: ${Colors.content};
`;

export const Label = styled.span`
    font-size: ${Fonts.sizes.label};
    font-weight: ${Fonts.weights.normal};
    color: ${Colors.lightContent};
`;
