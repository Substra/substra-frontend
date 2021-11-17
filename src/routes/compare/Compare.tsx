import { useEffect } from 'react';

import { useRoute } from 'wouter';

import { loadSeries } from '@/modules/series/SeriesSlice';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import { PATHS } from '@/routes';

import PerfBrowser from '@/components/PerfBrowser';

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
        dispatch(loadSeries(keys));
    }, []);

    const loading = useAppSelector((state) => state.series.loading);
    const series = useAppSelector((state) => state.series.series);

    return <PerfBrowser loading={loading} series={series} computePlan={null} />;
};
export default Compare;
