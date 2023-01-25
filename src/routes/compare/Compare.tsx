import { useRoute } from 'wouter';

import { HStack, Flex, Box } from '@chakra-ui/react';

import useSeriesStore from '@/features/series/useSeriesStore';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useEffectOnce from '@/hooks/useEffectOnce';
import usePerfBrowser, { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { PATHS } from '@/paths';

import MetadataModal from '@/components/MetadataModal';
import PerfBrowser from '@/components/PerfBrowser';
import PerfDownloadButton from '@/components/PerfDownloadButton';
import PerfSidebarComputePlans from '@/components/PerfSidebarComputePlans';

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
        fetchComputePlans(keys);
        fetchSeries(keys);
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
