import { useRef } from 'react';

import { Box, Button, Flex, Heading, HStack, VStack } from '@chakra-ui/react';
import { RiArrowLeftLine } from 'react-icons/ri';

import { SerieT } from '@/modules/series/SeriesTypes';

import PerfChart from '@/components/PerfChart';
import PerfDownloadButton from '@/components/PerfDownloadButton';

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
            padding="8"
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
            <HStack
                spacing={8}
                flexGrow={1}
                alignItems="stretch"
                overflow="hidden"
            >
                <Box
                    backgroundColor="white"
                    borderRadius="lg"
                    width="calc(100% - 300px)"
                >
                    <PerfChart
                        ref={perfChartRef}
                        series={series}
                        interactive={true}
                    />
                </Box>
                <Box
                    backgroundColor="white"
                    borderRadius="lg"
                    width="300px"
                    flexGrow={0}
                    flexShrink={0}
                    padding="5"
                >
                    <Heading
                        size="xxs"
                        fontWeight="bold"
                        textTransform="uppercase"
                        marginBottom="5"
                    >
                        Rank details
                    </Heading>
                </Box>
            </HStack>
        </VStack>
    );
};

export default PerfDetails;
