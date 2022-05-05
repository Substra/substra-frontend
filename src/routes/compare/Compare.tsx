import { useRoute } from 'wouter';

import { HStack, Flex, Box } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useEffectOnce from '@/hooks/useEffectOnce';
import usePerfBrowser, { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { retrieveComputePlans } from '@/modules/computePlans/CompareSlice';
import { loadSeries } from '@/modules/series/SeriesSlice';
import { PATHS } from '@/routes';

import HyperparametersModal from '@/components/HyperparametersModal';
import PerfBrowser from '@/components/PerfBrowser';
import PerfDownloadButton from '@/components/PerfDownloadButton';
import PerfSidebarComputePlans from '@/components/PerfSidebarComputePlans';

import CompareBreadcrumbs from './components/CompareBreadcrumbs';

const Compare = (): JSX.Element => {
    const [, params] = useRoute(PATHS.COMPARE);
    const keys = decodeURIComponent(params?.keys || '').split(',');
    useDocumentTitleEffect(
        (setDocumentTitle) =>
            setDocumentTitle(`Compare Compute Plans - ${keys.join(' - ')}`),
        []
    );

    const dispatchWithAutoAbortSeries = useDispatchWithAutoAbort();
    const dispatchWithAutoAbortComputePlans = useDispatchWithAutoAbort();

    useEffectOnce(() => {
        const destructors: (() => void)[] = [];
        destructors.push(
            dispatchWithAutoAbortComputePlans(
                retrieveComputePlans({ computePlanKeys: keys })
            )
        );
        destructors.push(dispatchWithAutoAbortSeries(loadSeries(keys)));
        return () => {
            for (const destructor of destructors) {
                destructor();
            }
        };
    });

    const loading = useAppSelector((state) => state.series.loading);
    const series = useAppSelector((state) => state.series.series);
    const computePlans = useAppSelector((state) => state.compare.computePlans);

    const { context } = usePerfBrowser(
        series,
        computePlans,
        'computePlan',
        loading
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
                        {HYPERPARAMETERS.length && <HyperparametersModal />}
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
