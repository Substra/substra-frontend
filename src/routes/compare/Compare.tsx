import { useRoute } from 'wouter';

import { HStack, Flex, Box } from '@chakra-ui/react';

import PerfBrowser from '@/features/perfBrowser/PerfBrowser';
import PerfSidebarComputePlans from '@/features/perfBrowser/PerfSidebarComputePlans';
import usePerfBrowser, {
    PerfBrowserContext,
} from '@/features/perfBrowser/usePerfBrowser';
import useSeriesStore from '@/features/series/useSeriesStore';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useEffectOnce from '@/hooks/useEffectOnce';
import { PATHS } from '@/paths';

import MetadataModal from '@/components/MetadataModal';
import PerfDownloadButton from '@/components/PerfDownloadButton';

import CompareBreadcrumbs from './components/CompareBreadcrumbs';
import useCompareStore from './useCompareStore';

const Compare = (): JSX.Element => {
    const [, params] = useRoute(PATHS.COMPARE);
    const keys = decodeURIComponent(params?.keys || '').split(',');
    useDocumentTitleEffect(
        (setDocumentTitle) =>
            setDocumentTitle(`Compare Compute Plans - ${keys.join(' - ')}`),
        []
    );

    const { fetchComputePlans, computePlans } = useCompareStore();
    const { series, fetchingSeries, fetchSeries } = useSeriesStore();

    useEffectOnce(() => {
        const abortComputePlans = fetchComputePlans(keys);
        const abortSeries = fetchSeries(keys);

        return () => {
            abortComputePlans();
            abortSeries();
        };
    });

    const { context } = usePerfBrowser(
        series,
        computePlans,
        'computePlan',
        fetchingSeries
    );

    return (
        <PerfBrowserContext.Provider value={context}>
            <Flex
                direction="column"
                alignItems="stretch"
                flexGrow={1}
                overflow="hidden"
                alignSelf="stretch"
            >
                <HStack
                    justifyContent="space-between"
                    background="white"
                    borderBottom="1px solid var(--chakra-colors-gray-100)"
                >
                    <CompareBreadcrumbs />
                    <HStack paddingX="8">
                        <MetadataModal />
                        <Box>
                            <PerfDownloadButton />
                        </Box>
                    </HStack>
                </HStack>
                <PerfBrowser SidebarComponent={PerfSidebarComputePlans} />
            </Flex>
        </PerfBrowserContext.Provider>
    );
};
export default Compare;
