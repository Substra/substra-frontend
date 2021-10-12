import { useEffect } from 'react';

import DescriptionDrawerSection from './DescriptionDrawerSection';
import DrawerHeader from './DrawerHeader';
import MetadataDrawerSection from './MetadataDrawerSection';
import {
    TableDrawerSection,
    TableDrawerSectionEntry,
    TableDrawerSectionKeyEntry,
} from './TableDrawerSection';
import {
    Drawer,
    DrawerContent,
    DrawerOverlay,
    useDisclosure,
    DrawerBody,
    VStack,
} from '@chakra-ui/react';
import { unwrapResult } from '@reduxjs/toolkit';

import {
    retrieveMetric,
    retrieveDescription,
} from '@/modules/metrics/MetricsSlice';
import { MetricType } from '@/modules/metrics/MetricsTypes';

import { formatDate } from '@/libs/utils';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useAssetSiderDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { PATHS } from '@/routes';

import PermissionTag from '@/components/PermissionTag';

const MetricSider = (): JSX.Element => {
    const { setLocationWithParams } = useLocationWithParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const key = useKeyFromPath(PATHS.METRIC);

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            if (!isOpen) {
                onOpen();
            }

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
    const metricLoading = useAppSelector(
        (state) => state.metrics.metricLoading
    );
    const description = useAppSelector((state) => state.metrics.description);
    const descriptionLoading = useAppSelector(
        (state) => state.metrics.descriptionLoading
    );

    useAssetSiderDocumentTitleEffect(key, metric, 'metric');

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={() => {
                setLocationWithParams(PATHS.METRICS);
                onClose();
            }}
            size="md"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader
                    title={metric?.name}
                    loading={metricLoading}
                    storageAddress={metric?.address.storage_address}
                    filename={`metric-${key}.zip`}
                    onClose={() => {
                        setLocationWithParams(PATHS.METRICS);
                        onClose();
                    }}
                />
                {metric && (
                    <DrawerBody as={VStack} alignItems="stretch" spacing="8">
                        <TableDrawerSection title="General">
                            <TableDrawerSectionKeyEntry value={metric.key} />
                            <TableDrawerSectionEntry title="Created">
                                {formatDate(metric.creation_date)}
                            </TableDrawerSectionEntry>
                            <TableDrawerSectionEntry title="Owner">
                                {metric.owner}
                            </TableDrawerSectionEntry>
                            <TableDrawerSectionEntry title="Processable by">
                                <PermissionTag
                                    permission={metric.permissions.process}
                                    listNodes={true}
                                />
                            </TableDrawerSectionEntry>
                            <TableDrawerSectionEntry title="Downloadable by">
                                <PermissionTag
                                    permission={metric.permissions.download}
                                    listNodes={true}
                                />
                            </TableDrawerSectionEntry>
                        </TableDrawerSection>
                        <MetadataDrawerSection metadata={metric.metadata} />
                        <DescriptionDrawerSection
                            loading={descriptionLoading}
                            description={description}
                        />
                    </DrawerBody>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default MetricSider;
