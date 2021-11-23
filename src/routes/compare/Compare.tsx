import { useEffect } from 'react';

import { useRoute } from 'wouter';

import { retrieveComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { loadSeries } from '@/modules/series/SeriesSlice';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import { PATHS } from '@/routes';

import PerfBrowser from '@/components/PerfBrowser';
import PerfSidebarSectionComputePlans from '@/components/PerfSidebarSectionComputePlans';
import PerfSidebarSettingsAverage from '@/components/PerfSidebarSettingsAverage';
import PerfSidebarSettingsNodes from '@/components/PerfSidebarSettingsNodes';

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

    return (
        <PerfBrowser
            loading={loading}
            series={series}
            computePlans={computePlans}
            settingsComponents={[
                PerfSidebarSettingsNodes,
                PerfSidebarSettingsAverage,
            ]}
            sectionComponents={[PerfSidebarSectionComputePlans]}
        />
    );
};
export default Compare;
