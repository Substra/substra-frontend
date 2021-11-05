import styled from '@emotion/styled';

import { Spaces } from '@/assets/theme';

const Marker = styled.div<{ color?: string }>`
    width: 16px;
    height: 8px;
    position: relative;
    margin-right: ${Spaces.small};
    color: ${({ color }) => color || 'inherit'};
`;

const Line = styled.div`
    width: 16px;
    height: 2px;
    border: 1px solid;

    position: absolute;
    top: 3px;
    left: 0;
`;

const Circle = styled.div`
    width: 8px;
    height: 8px;
    background-color: white;
    border-radius: 4px;
    border: 2px solid;

    position: absolute;
    top: 0;
    left: 4px;
`;

interface PerfChartLegendMarkerProps {
    color?: string;
}

const PerfChartLegendMarker = ({
    color,
}: PerfChartLegendMarkerProps): JSX.Element => (
    <Marker color={color}>
        <Line />
        <Circle />
    </Marker>
);

export default PerfChartLegendMarker;
