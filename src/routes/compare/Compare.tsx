import { useEffect } from 'react';

import { useRoute } from 'wouter';

import { retrieveComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { loadSeries } from '@/modules/series/SeriesSlice';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import usePerfBrowser, { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import { PATHS } from '@/routes';

import PerfBrowser from '@/components/PerfBrowser';
import PerfSidebarSectionComputePlans from '@/components/PerfSidebarSectionComputePlans';
import PerfSidebarSettingsNodes from '@/components/PerfSidebarSettingsNodes';
import PerfSidebarSettingsUnits from '@/components/PerfSidebarSettingsUnits';

declare const MELLODDY: boolean;

const Compare = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const [, params] = useRoute(PATHS.COMPARE);
    const keys = decodeURIComponent(params?.keys || '').split(',');
    useDocumentTitleEffect(
        (setDocumentTitle) =>
            setDocumentTitle(`Compare Compute Plans - ${keys.join(' - ')}`),
        []
    );

    useEffect(() => {
        dispatch(retrieveComputePlans({ computePlanKeys: keys }));
        dispatch(loadSeries(keys));
    }, []);

    const loading = useAppSelector((state) => state.series.loading);
    const series = useAppSelector((state) => state.series.series);
    const computePlans = useAppSelector(
        (state) => state.computePlans.computePlans
    );

    const { context } = usePerfBrowser(
        series,
        computePlans,
        'computePlan',
        loading
    );

    return (
        <PerfBrowserContext.Provider value={context}>
            <PerfBrowser
                settingsComponents={[
                    PerfSidebarSettingsNodes,
                    ...(MELLODDY ? [PerfSidebarSettingsUnits] : []),
                ]}
                sectionComponents={[PerfSidebarSectionComputePlans]}
            />
        </PerfBrowserContext.Provider>
    );
};
export default Compare;
