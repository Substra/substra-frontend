import StyledLink from './StyledLink';
import styled from '@emotion/styled';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';
import useNodeChartStyle from '@/hooks/useNodeChartStyle';

import { compilePath, PATHS } from '@/routes';

import PerfChartMarker from '@/components/PerfChartMarker';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const TOOLTIP_WIDTH = 340;

interface TooltipProps {
    x: number;
    y: number;
}

const Tooltip = styled.ul<TooltipProps>`
    position: absolute;
    left: calc(${({ x }) => x}px - 18px);
    top: calc(${({ y }) => y}px + 8px);
    width: ${TOOLTIP_WIDTH}px;
    border: 1px solid ${Colors.border};
    background-color: ${Colors.darkerBackground};
    border-radius: 4px;
    padding: ${Spaces.extraSmall} ${Spaces.small};
    font-size: ${Fonts.sizes.smallBody};
`;

const TooltipLi = styled.li`
    display: flex;
    align-items: baseline;
    margin-bottom: ${Spaces.extraSmall};
    &:last-child {
        margin-bottom: 0;
    }
`;

const Dl = styled.dl`
    display: grid;
    grid-template-columns: 55px 1fr;
`;

interface PerfChartTooltipProps {
    x: number;
    y: number;
    showTooltip: () => void;
    hideTooltip: () => void;
    points: DataPoint[];
}

const PerfChartTooltip = ({
    x,
    y,
    showTooltip,
    hideTooltip,
    points,
}: PerfChartTooltipProps): JSX.Element => {
    const nodeChartStyle = useNodeChartStyle();

    return (
        <Tooltip
            x={x}
            y={y}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {points.map((point) => (
                <TooltipLi key={point.testTaskKey}>
                    <PerfChartMarker
                        style={nodeChartStyle(point.worker).pointStyle}
                        color={nodeChartStyle(point.worker).color}
                    />
                    <Dl>
                        <dt>Perf</dt>
                        <dd>{point.y}</dd>
                        <dt>Rank</dt>
                        <dd>{point.x}</dd>
                        <dt>Test task</dt>
                        <dd>
                            <StyledLink
                                href={compilePath(PATHS.TASK, {
                                    key: point.testTaskKey,
                                })}
                            >
                                {point.testTaskKey}
                            </StyledLink>
                        </dd>
                    </Dl>
                </TooltipLi>
            ))}
        </Tooltip>
    );
};

export default PerfChartTooltip;
