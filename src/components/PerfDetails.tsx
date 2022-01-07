import { useRef, useState } from 'react';

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
    const [highlightedSerie, setHighlightedSerie] =
        useState<{ id: number; computePlanKey: string }>();
    const [hoveredRank, setHoveredRank] = useState<number | null>(null);
    const [selectedRank, setSelectedRank] = useState<number | null>(null);

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
                            interactive={true}
                            highlightedSerie={highlightedSerie}
                            setHoveredRank={setHoveredRank}
                            setSelectedRank={setSelectedRank}
                        />
                    </Box>
                    <PerfRankDetails
                        series={series}
                        hoveredRank={hoveredRank}
                        selectedRank={selectedRank}
                        setHighlightedSerie={setHighlightedSerie}
                    />
                </HStack>
            )}
        </VStack>
    );
};

export default PerfDetails;
