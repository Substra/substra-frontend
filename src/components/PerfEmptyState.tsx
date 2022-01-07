import { useContext } from 'react';

import { Flex } from '@chakra-ui/react';
import { RiFunctionLine } from 'react-icons/ri';

import { SerieT } from '@/modules/series/SeriesTypes';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import EmptyState from '@/components/EmptyState';

const PerfEmptyState = ({
    seriesGroups,
}: {
    seriesGroups: SerieT[][];
}): JSX.Element | null => {
    const { series } = useContext(PerfBrowserContext);
    if (series.length === 0) {
        return (
            <Flex
                flexGrow={1}
                alignItems="center"
                justifyContent="center"
                textAlign="center"
            >
                <EmptyState
                    title="No data to display"
                    subtitle="There are no test tasks in status done."
                    icon={<RiFunctionLine />}
                />
            </Flex>
        );
    }
    if (seriesGroups.length === 0) {
        return (
            <Flex
                flexGrow={1}
                alignItems="center"
                justifyContent="center"
                textAlign="center"
            >
                <EmptyState
                    title="No data to display"
                    subtitle="Select at least one node to display the data"
                    icon={<RiFunctionLine />}
                />
            </Flex>
        );
    }
    return null;
};
export default PerfEmptyState;
