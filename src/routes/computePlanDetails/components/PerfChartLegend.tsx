import PerfChartLegendMarker from './PerfChartLegendMarker';
import styled from '@emotion/styled';
import { Link } from 'wouter';

import { SerieT } from '@/modules/series/SeriesTypes';

import useNodesChartStyles from '@/hooks/useNodesChartStyles';

import { compilePath, PATHS } from '@/routes';

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
    const nodesChartStyles = useNodesChartStyles();
    const sortedSeries = [...series].sort((serieA, serieB) =>
        serieA.worker.localeCompare(serieB.worker)
    );

    return (
        <ul>
            {sortedSeries.map((serie) => (
                <Item key={serie.id}>
                    <ItemTitle color={nodesChartStyles[serie.worker].color}>
                        <PerfChartLegendMarker
                            style={nodesChartStyles[serie.worker].pointStyle}
                        />
                        {serie.worker}
                    </ItemTitle>
                    <Ul>
                        <Li>
                            Algorithm{' '}
                            <Link
                                href={compilePath(PATHS.ALGO, {
                                    key: serie.algoKey,
                                })}
                            >
                                {serie.algoName}
                            </Link>
                        </Li>
                        <Li>
                            Metric{' '}
                            <Link
                                href={compilePath(PATHS.METRIC, {
                                    key: serie.metricKey,
                                })}
                            >
                                {serie.metricName}
                            </Link>
                        </Li>
                        <Li>
                            Dataset{' '}
                            <Link
                                href={compilePath(PATHS.DATASET, {
                                    key: serie.datasetKey,
                                })}
                            >
                                {serie.datasetName}
                            </Link>
                        </Li>
                    </Ul>
                </Item>
            ))}
        </ul>
    );
};

export default PerfChartLegend;
