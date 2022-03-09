import { useContext } from 'react';

import { Flex } from '@chakra-ui/react';
import { RiFunctionLine } from 'react-icons/ri';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { SerieT } from '@/modules/series/SeriesTypes';

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
                    title="No performances to display"
                    subtitle="Performances can't be shown because no test tasks are done"
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
                    subtitle="Select at least one organization to display the data"
                    icon={<RiFunctionLine />}
                />
            </Flex>
        );
    }
    return null;
};
export default PerfEmptyState;
