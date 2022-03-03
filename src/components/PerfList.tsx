import { VStack, Wrap, WrapItem } from '@chakra-ui/react';

import { SerieT } from '@/modules/series/SeriesTypes';

import PerfCard from '@/components/PerfCard';
import PerfChart from '@/components/PerfChart';
import PerfEmptyState from '@/components/PerfEmptyState';

interface PerfListProps {
    seriesGroups: SerieT[][];
    onCardClick: (metricName: string) => void;
}
const PerfList = ({ seriesGroups, onCardClick }: PerfListProps) => {
    return (
        <VStack
            flexGrow={1}
            alignSelf="stretch"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing="4"
            padding="8"
            overflow="hidden"
        >
            <PerfEmptyState seriesGroups={seriesGroups} />
            <Wrap spacing="3" justify="center">
                {seriesGroups.map((series) => (
                    <WrapItem key={`${series[0].metricKey}-${series[0].id}`}>
                        <PerfCard
                            title={series[0].metricName}
                            onClick={() => onCardClick(series[0].metricName)}
                        >
                            <PerfChart
                                series={series}
                                size="thumbnail"
                                zoomEnabled={false}
                            />
                        </PerfCard>
                    </WrapItem>
                ))}
            </Wrap>
        </VStack>
    );
};
export default PerfList;
