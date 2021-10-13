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
    retrieveDataset,
    retrieveDescription,
} from '@/modules/datasets/DatasetsSlice';
import { DatasetType } from '@/modules/datasets/DatasetsTypes';

import { formatDate } from '@/libs/utils';

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
    TableDrawerSectionEntry,
    TableDrawerSectionKeyEntry,
} from '@/components/TableDrawerSection';

const DatasetDrawer = (): JSX.Element => {
    const { setLocationWithParams } = useLocationWithParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const key = useKeyFromPath(PATHS.DATASET);

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            if (!isOpen) {
                onOpen();
            }

            dispatch(retrieveDataset(key))
                .then(unwrapResult)
                .then((dataset: DatasetType) => {
                    dispatch(
                        retrieveDescription(dataset.description.storage_address)
                    );
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

    useAssetSiderDocumentTitleEffect(key, dataset, 'dataset');

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={() => {
                setLocationWithParams(PATHS.DATASETS);
                onClose();
            }}
            size="md"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader
                    title={dataset?.name}
                    loading={datasetLoading}
                    storageAddress={dataset?.opener.storage_address}
                    filename={`dataset-opener-${key}.py`}
                    onClose={() => {
                        setLocationWithParams(PATHS.DATASETS);
                        onClose();
                    }}
                />
                {dataset && (
                    <DrawerBody as={VStack} alignItems="stretch" spacing="8">
                        <TableDrawerSection title="General">
                            <TableDrawerSectionKeyEntry value={dataset.key} />
                            <TableDrawerSectionEntry title="Created">
                                {formatDate(dataset.creation_date)}
                            </TableDrawerSectionEntry>
                            <TableDrawerSectionEntry title="Owner">
                                {dataset.owner}
                            </TableDrawerSectionEntry>
                            <TableDrawerSectionEntry title="Processable by">
                                <PermissionTag
                                    permission={dataset.permissions.process}
                                    listNodes={true}
                                />
                            </TableDrawerSectionEntry>
                            <TableDrawerSectionEntry title="Downloadable by">
                                <PermissionTag
                                    permission={dataset.permissions.download}
                                    listNodes={true}
                                />
                            </TableDrawerSectionEntry>
                        </TableDrawerSection>
                        <MetadataDrawerSection metadata={dataset.metadata} />
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

export default DatasetDrawer;
