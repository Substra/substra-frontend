import { useContext } from 'react';

import { Button, Flex, Kbd } from '@chakra-ui/react';
import { RiArrowLeftLine } from 'react-icons/ri';

import { useKeyPress } from '@/hooks/useKeyPress';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { SerieT } from '@/modules/series/SeriesTypes';

import PerfChart from '@/components/PerfChart';
import PerfEmptyState from '@/components/PerfEmptyState';

type PerfDetailsProps = {
    series: SerieT[];
};

const PerfDetails = ({ series }: PerfDetailsProps): JSX.Element => {
    const {
        perfChartRef,
        setSelectedMetricName,
        setSelectedMetricKey,
        setSelectedMetricOutputIdentifier,
    } = useContext(PerfBrowserContext);

    const resetSelectedMetric = () => {
        setSelectedMetricName('');
        setSelectedMetricKey('');
        setSelectedMetricOutputIdentifier('');
    };

    useKeyPress('Escape', () => resetSelectedMetric());

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
                        rightIcon={<Kbd backgroundColor="white">Esc</Kbd>}
                        onClick={() => resetSelectedMetric()}
                    >
                        Go back
                    </Button>
                </>
            )}
        </Flex>
    );
};

export default PerfDetails;
