import { useRef } from 'react';

import PerfRankDetails from './PerfRankDetails';
import { Box, Button, Flex, HStack, VStack } from '@chakra-ui/react';
import { RiArrowLeftLine } from 'react-icons/ri';

import { SerieT } from '@/modules/series/SeriesTypes';

import PerfChart from '@/components/PerfChart';
import PerfDownloadButton from '@/components/PerfDownloadButton';
import PerfEmptyState from '@/components/PerfEmptyState';

interface PerfDetailsProps {
    metricName: string;
    onBack: () => void;
    series: SerieT[];
}
const PerfDetails = ({
    metricName,
    onBack,
    series,
}: PerfDetailsProps): JSX.Element => {
    const perfChartRef = useRef<HTMLDivElement>(null);

    return (
        <VStack
            flexGrow={1}
            alignSelf="stretch"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing="4"
            paddingX="8"
            paddingY="4"
            overflow="hidden"
            height="100%"
        >
            <Flex justifyContent="space-between" alignItems="center">
                <Button
                    leftIcon={<RiArrowLeftLine />}
                    onClick={onBack}
                    variant="ghost"
                    size="md"
                    fontWeight="medium"
                >
                    {metricName}
                </Button>
                <PerfDownloadButton
                    series={series}
                    downloadRef={perfChartRef}
                />
            </Flex>
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
