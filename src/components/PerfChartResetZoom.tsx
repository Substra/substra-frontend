import styled from '@emotion/styled';

import { Colors, Spaces, Fonts } from '@/assets/theme';

const PerfChartResetZoom = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    border: 1px solid ${Colors.border};
    border-radius: 4px;
    padding: ${Spaces.extraSmall} ${Spaces.small};
    background-color: ${Colors.background};
    font-size: ${Fonts.sizes.smallBody};

    &:hover {
        border-color: ${Colors.primary};
        color: ${Colors.primary};
    }
`;

export default PerfChartResetZoom;
