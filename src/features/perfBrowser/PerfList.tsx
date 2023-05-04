import { VStack, Wrap, WrapItem } from '@chakra-ui/react';

import PerfCard from '@/features/perfBrowser/PerfCard';
import PerfChart from '@/features/perfBrowser/PerfChart';
import PerfEmptyState from '@/features/perfBrowser/PerfEmptyState';
import { SerieT } from '@/types/SeriesTypes';

type PerfListProps = {
    seriesGroups: SerieT[][];
    onCardClick: (
        metricName: string,
        metricKey: string,
        identifier: string
    ) => void;
};
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
                            title={series[0].identifier}
                            onClick={() =>
                                onCardClick(
                                    series[0].metricName,
                                    series[0].metricKey,
                                    series[0].identifier
                                )
                            }
                        >
                            <PerfChart series={series} optionsEnabled={false} />
                        </PerfCard>
                    </WrapItem>
                ))}
            </Wrap>
        </VStack>
    );
};
export default PerfList;
