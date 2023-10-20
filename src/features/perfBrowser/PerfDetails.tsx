import { useContext } from 'react';

import { Button, Flex, Kbd } from '@chakra-ui/react';
import { RiArrowLeftLine } from 'react-icons/ri';

import PerfChart from '@/features/perfBrowser/PerfChart';
import PerfEmptyState from '@/features/perfBrowser/PerfEmptyState';
import { PerfBrowserContext } from '@/features/perfBrowser/usePerfBrowser';
import { useKeyPress } from '@/hooks/useKeyPress';
import { SerieT } from '@/types/SeriesTypes';

type PerfDetailsProps = {
    series: SerieT[];
};

const PerfDetails = ({ series }: PerfDetailsProps): JSX.Element => {
    const { perfChartRef, setSelectedIdentifier } =
        useContext(PerfBrowserContext);

    const resetSelectedMetric = () => {
        setSelectedIdentifier('');
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
            data-cy="perf-details"
        >
            <PerfEmptyState seriesGroups={series.length > 0 ? [series] : []} />
            {series.length > 0 && (
                <>
                    <PerfChart
                        ref={perfChartRef}
                        series={series}
                        optionsEnabled={true}
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
