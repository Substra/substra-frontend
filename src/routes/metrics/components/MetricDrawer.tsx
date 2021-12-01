import { useEffect } from 'react';

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

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useAssetSiderDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { PATHS } from '@/routes';

import DescriptionDrawerSection from '@/components/DescriptionDrawerSection';
import DrawerHeader from '@/components/DrawerHeader';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';
import PermissionTag from '@/components/PermissionTag';
import {
    TableDrawerSection,
    TableDrawerSectionDateEntry,
    TableDrawerSectionEntry,
    TableDrawerSectionKeyEntry,
} from '@/components/TableDrawerSection';

const MetricDrawer = (): JSX.Element => {
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
            autoFocus={false}
        >
            <DrawerOverlay />
            <DrawerContent data-cy="drawer">
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
                            <TableDrawerSectionDateEntry
                                title="Created"
                                date={metric.creation_date}
                            />
                            <TableDrawerSectionEntry title="Owner">
                                {metric.owner}
                            </TableDrawerSectionEntry>
                            <TableDrawerSectionEntry title="Permissions">
                                <PermissionTag
                                    permission={metric.permissions.process}
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

export default MetricDrawer;
