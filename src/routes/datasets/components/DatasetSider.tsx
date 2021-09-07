import { useEffect } from 'react';

import DataSamplesTabs from './DataSamplesTabs';
import OpenerSiderSection, {
    LoadingOpenerSiderSection,
} from './OpenerSiderSection';
import { unwrapResult } from '@reduxjs/toolkit';

import {
    retrieveDataset,
    retrieveDescription,
    retrieveOpener,
} from '@/modules/datasets/DatasetsSlice';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useAssetSiderDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { PATHS } from '@/routes';

import DescriptionSiderSection, {
    LoadingDescriptionSiderSection,
} from '@/components/DescriptionSiderSection';
import KeySiderSection from '@/components/KeySiderSection';
import PermissionSiderSection, {
    LoadingPermissionSiderSection,
} from '@/components/PermissionSiderSection';
import Sider from '@/components/Sider';
import {
    SiderSection,
    SiderSectionTitle,
    SimpleSiderSection,
} from '@/components/SiderSection';
import Skeleton from '@/components/Skeleton';

const DatasetSider = (): JSX.Element => {
    const { setLocationWithParams } = useLocationWithParams();
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

    useAssetSiderDocumentTitleEffect(key, dataset, 'dataset');

    return (
        <Sider
            visible={visible}
            onCloseButtonClick={() => setLocationWithParams(PATHS.DATASETS)}
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
                <PermissionSiderSection permissions={dataset.permissions} />
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
