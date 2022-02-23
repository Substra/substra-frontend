import { useContext } from 'react';

import PerfRankDetails from './PerfRankDetails';
import { Box, HStack, VStack } from '@chakra-ui/react';

import { SerieT } from '@/modules/series/SeriesTypes';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import PerfChart from '@/components/PerfChart';
import PerfEmptyState from '@/components/PerfEmptyState';

interface PerfDetailsProps {
    series: SerieT[];
}
const PerfDetails = ({ series }: PerfDetailsProps): JSX.Element => {
    const { perfChartRef } = useContext(PerfBrowserContext);

    return (
        <VStack
            flexGrow={1}
            alignSelf="stretch"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing="4"
            padding="8"
            overflow="hidden"
            height="100%"
        >
            <PerfEmptyState seriesGroups={series.length > 0 ? [series] : []} />
            {series.length > 0 && (
                <HStack
                    spacing={8}
                    flexGrow={1}
                    alignItems="stretch"
                    overflow="hidden"
                >
                    <Box backgroundColor="white" width="calc(100% - 300px)">
                        <PerfChart
                            ref={perfChartRef}
                            series={series}
                            size="full"
                            zoomEnabled={true}
                        />
                    </Box>
                    <PerfRankDetails series={series} />
                </HStack>
            )}
        </VStack>
    );
};

export default PerfDetails;
