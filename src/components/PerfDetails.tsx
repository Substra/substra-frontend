import { useContext } from 'react';

import { Button, Flex } from '@chakra-ui/react';
import { RiArrowLeftLine } from 'react-icons/ri';

import { SerieT } from '@/modules/series/SeriesTypes';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import PerfChart from '@/components/PerfChart';
import PerfEmptyState from '@/components/PerfEmptyState';

interface PerfDetailsProps {
    series: SerieT[];
}
const PerfDetails = ({ series }: PerfDetailsProps): JSX.Element => {
    const { perfChartRef, setSelectedMetricName } =
        useContext(PerfBrowserContext);

    return (
        <Flex
            flexGrow={1}
            alignSelf="stretch"
            justifyContent="flex-start"
            alignItems="stretch"
            overflow="hidden"
            height="100%"
            position="relative"
        >
            <PerfEmptyState seriesGroups={series.length > 0 ? [series] : []} />
            {series.length > 0 && (
                <>
                    <PerfChart
                        ref={perfChartRef}
                        series={series}
                        size="full"
                        zoomEnabled={true}
                    />
                    <Button
                        position="absolute"
                        top="5"
                        left="20"
                        size="sm"
                        variant="outline"
                        backgroundColor="white"
                        leftIcon={<RiArrowLeftLine />}
                        onClick={() => setSelectedMetricName('')}
                    >
                        Go back
                    </Button>
                </>
            )}
        </Flex>
    );
};

export default PerfDetails;
