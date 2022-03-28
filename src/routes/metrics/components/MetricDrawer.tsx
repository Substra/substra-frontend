import { useEffect } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';

import {
    Drawer,
    DrawerContent,
    DrawerOverlay,
    useDisclosure,
    DrawerBody,
    VStack,
    Skeleton,
} from '@chakra-ui/react';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import {
    retrieveMetric,
    retrieveDescription,
} from '@/modules/metrics/MetricsSlice';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import { PATHS } from '@/routes';

import DescriptionDrawerSection from '@/components/DescriptionDrawerSection';
import DrawerHeader from '@/components/DrawerHeader';
import {
    DrawerSection,
    DrawerSectionDateEntry,
    DrawerSectionEntry,
    DrawerSectionKeyEntry,
} from '@/components/DrawerSection';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';
import PermissionTag from '@/components/PermissionTag';

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

    useDocumentTitleEffect(
        (setDocumentTitle) => {
            if (metric?.name) {
                setDocumentTitle(metric.name);
            }
        },
        [metric?.name]
    );

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

                <DrawerBody
                    as={VStack}
                    alignItems="stretch"
                    spacing="8"
                    paddingX="5"
                    paddingY="8"
                >
                    <DrawerSection title="General">
                        <DrawerSectionKeyEntry
                            value={metric?.key}
                            loading={metricLoading}
                        />
                        <DrawerSectionDateEntry
                            title="Created"
                            date={metric?.creation_date}
                            loading={metricLoading}
                        />
                        <DrawerSectionEntry title="Owner">
                            {metricLoading || !metric ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                metric.owner
                            )}
                        </DrawerSectionEntry>
                        <DrawerSectionEntry title="Permissions">
                            {metricLoading || !metric ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                <PermissionTag
                                    permission={metric.permissions.process}
                                    listNodes={true}
                                />
                            )}
                        </DrawerSectionEntry>
                    </DrawerSection>
                    <MetadataDrawerSection
                        metadata={metric?.metadata}
                        loading={metricLoading}
                    />
                    <DescriptionDrawerSection
                        loading={descriptionLoading}
                        description={description}
                    />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default MetricDrawer;
