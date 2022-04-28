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
import { retrieveAlgo, retrieveDescription } from '@/modules/algos/AlgosSlice';
import { AlgoT } from '@/modules/algos/AlgosTypes';
import { getAlgoCategory } from '@/modules/algos/AlgosUtils';
import { PATHS } from '@/routes';

import DescriptionDrawerSection from '@/components/DescriptionDrawerSection';
import DrawerHeader from '@/components/DrawerHeader';
import {
    DrawerSection,
    DrawerSectionDateEntry,
    DrawerSectionEntry,
    DrawerSectionKeyEntry,
    PermissionsDrawerSectionEntry,
} from '@/components/DrawerSection';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';

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
                setDocumentTitle(algo.name);
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
                    title={algo?.name}
                    loading={algoLoading}
                    storageAddress={algo?.algorithm.storage_address}
                    filename={`algo-${key}.zip`}
                    onClose={() => {
                        setLocationWithParams(PATHS.ALGOS);
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
                        <DrawerSectionEntry title="Category">
                            {algoLoading || !algo ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                getAlgoCategory(algo)
                            )}
                        </DrawerSectionEntry>
                        <DrawerSectionKeyEntry
                            value={algo?.key}
                            loading={algoLoading}
                        />
                        <DrawerSectionDateEntry
                            title="Created"
                            date={algo?.creation_date}
                            loading={algoLoading}
                        />
                        <DrawerSectionEntry title="Owner">
                            {algoLoading || !algo ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                algo.owner
                            )}
                        </DrawerSectionEntry>
                        <PermissionsDrawerSectionEntry
                            loading={algoLoading}
                            asset={algo}
                        />
                    </DrawerSection>
                    <MetadataDrawerSection
                        metadata={algo?.metadata}
                        loading={algoLoading}
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

export default AlgoDrawer;
