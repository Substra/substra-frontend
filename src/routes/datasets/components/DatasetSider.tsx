import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { unwrapResult } from '@reduxjs/toolkit';

import KeySiderSection from '@/components/KeySiderSection';
import PermissionSiderSection, {
    LoadingPermissionSiderSection,
} from '@/components/PermissionSiderSection';
import {
    SiderSection,
    SiderSectionTitle,
    SimpleSiderSection,
} from '@/components/SiderSection';
import {
    retrieveDataset,
    retrieveDescription,
    retrieveOpener,
} from '@/modules/datasets/DatasetsSlice';
import { PATHS, useKeyFromPath } from '@/routes';
import { useAppDispatch, useAppSelector } from '@/hooks';
import Skeleton from '@/components/Skeleton';
import DescriptionSiderSection, {
    LoadingDescriptionSiderSection,
} from '@/components/DescriptionSiderSection';
import Sider from '@/components/Sider';

import OpenerSiderSection, {
    LoadingOpenerSiderSection,
} from './OpenerSiderSection';
import DataSamplesTabs from './DataSamplesTabs';

const DatasetSider = (): JSX.Element => {
    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.DATASET);

    const visible = !!key;

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            dispatch(retrieveDataset(key))
                .then(unwrapResult)
                .then((dataset) => {
                    dispatch(
                        retrieveDescription(dataset.description.storage_address)
                    );
                    dispatch(retrieveOpener(dataset.opener.storage_address));
                });
        }
    }, [key]);

    const dataset = useAppSelector((state) => state.datasets.dataset);
    const datasetLoading = useAppSelector(
        (state) => state.datasets.datasetLoading
    );

    const description = useAppSelector((state) => state.datasets.description);
    const descriptionLoading = useAppSelector(
        (state) => state.datasets.descriptionLoading
    );

    const opener = useAppSelector((state) => state.datasets.opener);
    const openerLoading = useAppSelector(
        (state) => state.datasets.openerLoading
    );

    return (
        <Sider
            visible={visible}
            onCloseButtonClick={() => setLocation(PATHS.DATASETS)}
            titleType="Dataset details"
            title={
                datasetLoading || !dataset ? (
                    <Skeleton width={370} height={30} />
                ) : (
                    dataset.name
                )
            }
        >
            <KeySiderSection assetKey={key || ''} />

            {descriptionLoading && <LoadingDescriptionSiderSection />}
            {!descriptionLoading && !description && (
                <SimpleSiderSection title="Description" content="N/A" />
            )}
            {!descriptionLoading && description && (
                <DescriptionSiderSection description={description} />
            )}

            {datasetLoading && <LoadingPermissionSiderSection />}
            {!datasetLoading && !dataset && (
                <SimpleSiderSection title="Permissions" content="N/A" />
            )}
            {!datasetLoading && dataset && (
                <PermissionSiderSection
                    permission={dataset.permissions.process}
                />
            )}

            {openerLoading && <LoadingOpenerSiderSection />}
            {!openerLoading && !opener && (
                <SimpleSiderSection title="Opener" content="N/A" />
            )}
            {!openerLoading && opener && <OpenerSiderSection opener={opener} />}

            {dataset && (
                <SiderSection>
                    <SiderSectionTitle>Data samples</SiderSectionTitle>
                    <DataSamplesTabs
                        trainDataSamples={dataset.train_data_sample_keys}
                        testDataSamples={dataset.test_data_sample_keys}
                    />
                </SiderSection>
            )}
        </Sider>
    );
};

export default DatasetSider;
