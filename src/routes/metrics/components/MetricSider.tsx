import { useEffect } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';

import {
    retrieveMetric,
    retrieveDescription,
} from '@/modules/metrics/MetricsSlice';
import { MetricType } from '@/modules/metrics/MetricsTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersLocation,
} from '@/hooks';
import { useAssetSiderDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';

import { PATHS } from '@/routes';

import DescriptionSiderSection, {
    LoadingDescriptionSiderSection,
} from '@/components/DescriptionSiderSection';
import KeySiderSection from '@/components/KeySiderSection';
import PermissionSiderSection from '@/components/PermissionSiderSection';
import Sider from '@/components/Sider';
import SiderBottomButton from '@/components/SiderBottomButton';
import { SimpleSiderSection } from '@/components/SiderSection';

const MetricSider = (): JSX.Element => {
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();
    const key = useKeyFromPath(PATHS.METRIC);

    const visible = !!key;

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            dispatch(retrieveMetric(key))
                .then(unwrapResult)
                .then((metric: MetricType) => {
                    dispatch(
                        retrieveDescription(metric.description.storage_address)
                    );
                });
        }
    }, [key]);

    const metric = useAppSelector((state) => state.metrics.metric);
    const description = useAppSelector((state) => state.metrics.description);
    const descriptionLoading = useAppSelector(
        (state) => state.metrics.descriptionLoading
    );

    useAssetSiderDocumentTitleEffect(key, metric, 'metric');

    return (
        <Sider
            visible={visible}
            onCloseButtonClick={() =>
                setSearchFiltersLocation(PATHS.METRICS, searchFilters)
            }
            titleType="Metric details"
            title={metric ? metric.name : 'Metric name'}
        >
            <KeySiderSection assetKey={key || ''} />

            {descriptionLoading && <LoadingDescriptionSiderSection />}
            {!descriptionLoading && !description && (
                <SimpleSiderSection title="Description" content="N/A" />
            )}
            {!descriptionLoading && description && (
                <DescriptionSiderSection description={description} />
            )}

            {metric && (
                <PermissionSiderSection
                    permission={metric.permissions.process}
                />
            )}
            {metric && (
                <SiderBottomButton
                    target={metric.metrics.storage_address}
                    filename={`metric-${key}.zip`}
                >
                    Download metric
                </SiderBottomButton>
            )}
        </Sider>
    );
};

export default MetricSider;
