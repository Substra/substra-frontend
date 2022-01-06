import { useContext } from 'react';

import { Button, Flex, Icon, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { RiArrowLeftLine, RiDownloadLine } from 'react-icons/ri';
import { useLocation } from 'wouter';

import { SerieT } from '@/modules/series/SeriesTypes';

import useDownloadPerfCsv from '@/hooks/useDownloadPerfCsv';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import { compilePath, PATHS } from '@/routes';

import PerfCard from '@/components/PerfCard';
import PerfChart from '@/components/PerfChart';

interface PerfListProps {
    seriesGroups: SerieT[][];
    onCardClick: (metricName: string) => void;
}
const PerfList = ({ seriesGroups, onCardClick }: PerfListProps) => {
    const { computePlans } = useContext(PerfBrowserContext);
    const downloadPerfCsv = useDownloadPerfCsv(seriesGroups);
    const [, setLocation] = useLocation();
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
                    onClick={() =>
                        setLocation(
                            computePlans.length > 1
                                ? PATHS.COMPUTE_PLANS
                                : compilePath(PATHS.COMPUTE_PLAN_TASKS_ROOT, {
                                      key: computePlans[0].key,
                                  })
                        )
                    }
                    variant="ghost"
                    size="md"
                    fontWeight="medium"
                >
                    Metrics
                </Button>
                <Button
                    leftIcon={<Icon as={RiDownloadLine} />}
                    variant="solid"
                    colorScheme="teal"
                    size="sm"
                    onClick={downloadPerfCsv}
                >
                    Download as CSV
                </Button>
            </Flex>
            <Wrap spacing="3">
                {seriesGroups.map((series) => (
                    <WrapItem key={`${series[0].metricKey}-${series[0].id}`}>
                        <PerfCard
                            title={series[0].metricName}
                            onClick={() => onCardClick(series[0].metricName)}
                        >
                            <PerfChart
                                series={series}
                                interactive={false}
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                setHoveredRank={() => {}}
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                setSelectedRank={() => {}}
                            />
                        </PerfCard>
                    </WrapItem>
                ))}
            </Wrap>
        </VStack>
    );
};
export default PerfList;
