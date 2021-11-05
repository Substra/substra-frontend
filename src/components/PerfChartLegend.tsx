import styled from '@emotion/styled';

import { SerieT } from '@/modules/series/SeriesTypes';

import useNodeChartStyle from '@/hooks/useNodeChartStyle';

import { compilePath, PATHS } from '@/routes';

import PerfChartMarker from '@/components/PerfChartMarker';
import StyledLink from '@/components/StyledLink';

import { Fonts, Spaces } from '@/assets/theme';

const Item = styled.li`
    margin-bottom: ${Spaces.medium};
    font-size: ${Fonts.sizes.label};
`;
interface ItemTitleProps {
    color: string;
}
const ItemTitle = styled.div<ItemTitleProps>`
    color: ${({ color }) => color};
    display: flex;
    align-items: center;
`;
const Ul = styled.ul`
    margin-left: ${Spaces.large};
`;

const Li = styled.li`
    margin: ${Spaces.small} 0;
`;

interface PerfChartLegendProps {
    series: SerieT[];
}
const PerfChartLegend = ({ series }: PerfChartLegendProps): JSX.Element => {
    const nodeChartStyle = useNodeChartStyle();
    const sortedSeries = [...series].sort((serieA, serieB) =>
        serieA.worker.localeCompare(serieB.worker)
    );

    return (
        <ul>
            {sortedSeries.map((serie) => (
                <Item key={serie.id}>
                    <ItemTitle color={nodeChartStyle(serie.worker).color}>
                        <PerfChartMarker />
                        {serie.worker}
                    </ItemTitle>
                    <Ul>
                        <Li>
                            Algorithm{' '}
                            <StyledLink
                                href={compilePath(PATHS.ALGO, {
                                    key: serie.algoKey,
                                })}
                            >
                                {serie.algoName}
                            </StyledLink>
                        </Li>
                        <Li>
                            Metric{' '}
                            <StyledLink
                                href={compilePath(PATHS.METRIC, {
                                    key: serie.metricKey,
                                })}
                            >
                                {serie.metricName}
                            </StyledLink>
                        </Li>
                        <Li>
                            Dataset{' '}
                            <StyledLink
                                href={compilePath(PATHS.DATASET, {
                                    key: serie.datasetKey,
                                })}
                            >
                                {serie.datasetName}
                            </StyledLink>
                        </Li>
                    </Ul>
                </Item>
            ))}
        </ul>
    );
};

export default PerfChartLegend;
