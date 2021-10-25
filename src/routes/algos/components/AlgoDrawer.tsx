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

import { retrieveAlgo, retrieveDescription } from '@/modules/algos/AlgosSlice';
import { AlgoT } from '@/modules/algos/AlgosTypes';
import { getAlgoCategory } from '@/modules/algos/AlgosUtils';

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
    TableDrawerSectionCreatedEntry,
    TableDrawerSectionEntry,
    TableDrawerSectionKeyEntry,
} from '@/components/TableDrawerSection';

const AlgoDrawer = (): JSX.Element => {
    const { setLocationWithParams } = useLocationWithParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const key = useKeyFromPath(PATHS.ALGO);

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            if (!isOpen) {
                onOpen();
            }

            dispatch(retrieveAlgo(key))
                .then(unwrapResult)
                .then((algo: AlgoT) => {
                    dispatch(
                        retrieveDescription(algo.description.storage_address)
                    );
                });
        }
    }, [key]);

    const algo = useAppSelector((state) => state.algos.algo);
    const algoLoading = useAppSelector((state) => state.algos.algoLoading);
    const description = useAppSelector((state) => state.algos.description);
    const descriptionLoading = useAppSelector(
        (state) => state.algos.descriptionLoading
    );

    useAssetSiderDocumentTitleEffect(key, algo, 'algo');

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={() => {
                setLocationWithParams(PATHS.ALGOS);
                onClose();
            }}
            size="md"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader
                    title={algo?.name}
                    loading={algoLoading}
                    storageAddress={algo?.algorithm.storage_address}
                    filename={`algo-${key}.zip`}
                    onClose={() => {
                        setLocationWithParams(PATHS.ALGOS);
                        onClose();
                    }}
                />
                {algo && (
                    <DrawerBody as={VStack} alignItems="stretch" spacing="8">
                        <TableDrawerSection title="General">
                            <TableDrawerSectionEntry title="Category">
                                {getAlgoCategory(algo)}
                            </TableDrawerSectionEntry>
                            <TableDrawerSectionKeyEntry value={algo.key} />
                            <TableDrawerSectionCreatedEntry
                                date={algo.creation_date}
                            />
                            <TableDrawerSectionEntry title="Owner">
                                {algo.owner}
                            </TableDrawerSectionEntry>
                            <TableDrawerSectionEntry title="Processable by">
                                <PermissionTag
                                    permission={algo.permissions.process}
                                    listNodes={true}
                                />
                            </TableDrawerSectionEntry>
                            <TableDrawerSectionEntry title="Downloadable by">
                                <PermissionTag
                                    permission={algo.permissions.download}
                                    listNodes={true}
                                />
                            </TableDrawerSectionEntry>
                        </TableDrawerSection>
                        <MetadataDrawerSection metadata={algo.metadata} />
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

export default AlgoDrawer;
