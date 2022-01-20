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
import { getNodeLabel, pseudonymize } from '@/modules/nodes/NodesUtils';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

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

    useDocumentTitleEffect(
        (setDocumentTitle) => {
            if (algo?.name) {
                setDocumentTitle(pseudonymize(algo.name));
            }
        },
        [algo?.name]
    );

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={() => {
                setLocationWithParams(PATHS.ALGOS);
                onClose();
            }}
            size="md"
            autoFocus={false}
        >
            <DrawerOverlay />
            <DrawerContent data-cy="drawer">
                <DrawerHeader
                    title={algo ? pseudonymize(algo.name) : undefined}
                    loading={algoLoading}
                    storageAddress={algo?.algorithm.storage_address}
                    filename={`algo-${key}.zip`}
                    onClose={() => {
                        setLocationWithParams(PATHS.ALGOS);
                        onClose();
                    }}
                />
                {algo && (
                    <DrawerBody
                        as={VStack}
                        alignItems="stretch"
                        spacing="8"
                        paddingX="5"
                        paddingY="8"
                    >
                        <DrawerSection title="General">
                            <DrawerSectionEntry title="Category">
                                {getAlgoCategory(algo)}
                            </DrawerSectionEntry>
                            <DrawerSectionKeyEntry value={algo.key} />
                            <DrawerSectionDateEntry
                                title="Created"
                                date={algo.creation_date}
                            />
                            <DrawerSectionEntry title="Owner">
                                {getNodeLabel(algo.owner)}
                            </DrawerSectionEntry>
                            <DrawerSectionEntry title="Permissions">
                                <PermissionTag
                                    permission={algo.permissions.process}
                                    listNodes={true}
                                />
                            </DrawerSectionEntry>
                        </DrawerSection>
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
