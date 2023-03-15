import { useEffect } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';

import {
    Drawer,
    DrawerContent,
    DrawerOverlay,
    useDisclosure,
    DrawerBody,
    VStack,
    IconButton,
} from '@chakra-ui/react';
import { RiDownload2Line } from 'react-icons/ri';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import useUpdateName from '@/hooks/useUpdateName';
import { downloadFromApi } from '@/libs/request';
import {
    retrieveFunction,
    retrieveDescription,
    updateFunction,
} from '@/modules/functions/FunctionsSlice';
import { FunctionT } from '@/modules/functions/FunctionsTypes';
import { PATHS } from '@/paths';

import DescriptionDrawerSection from '@/components/DescriptionDrawerSection';
import DrawerHeader from '@/components/DrawerHeader';
import {
    DrawerSection,
    DrawerSectionDateEntry,
    DrawerSectionKeyEntry,
    OrganizationDrawerSectionEntry,
    PermissionsDrawerSectionEntry,
} from '@/components/DrawerSection';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';

import InputsOutputsDrawerSection from './InputsOutputsDrawerSection';

const FunctionDrawer = (): JSX.Element => {
    const setLocationPreserveParams = useSetLocationPreserveParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const key = useKeyFromPath(PATHS.FUNCTION);

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            if (!isOpen) {
                onOpen();

                dispatch(retrieveFunction(key))
                    .then(unwrapResult)
                    .then((func: FunctionT) => {
                        dispatch(
                            retrieveDescription(
                                func.description.storage_address
                            )
                        );
                    });
            }
        }
    }, [dispatch, isOpen, key, onOpen]);

    const func = useAppSelector((state) => state.functions.function);
    const functionLoading = useAppSelector(
        (state) => state.functions.functionLoading
    );
    const description = useAppSelector((state) => state.functions.description);
    const descriptionLoading = useAppSelector(
        (state) => state.functions.descriptionLoading
    );

    useDocumentTitleEffect(
        (setDocumentTitle) => {
            if (func?.name) {
                setDocumentTitle(func.name);
            }
        },
        [func?.name]
    );

    const downloadFunction = () => {
        if (func) {
            downloadFromApi(
                func.function.storage_address,
                `function-${key}.zip`
            );
        }
    };

    const { updateNameDialog, updateNameButton } = useUpdateName({
        dialogTitle: 'Rename function',
        assetKey: func?.key ?? '',
        assetName: func?.name ?? '',
        assetUpdating: useAppSelector(
            (state) => state.functions.functionUpdating
        ),
        updateSlice: updateFunction,
    });

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={() => {
                setLocationPreserveParams(PATHS.FUNCTIONS);
                onClose();
            }}
            size="md"
            autoFocus={false}
        >
            <DrawerOverlay />
            <DrawerContent data-cy="drawer">
                <DrawerHeader
                    title={func?.name}
                    loading={functionLoading}
                    onClose={() => {
                        setLocationPreserveParams(PATHS.FUNCTIONS);
                        onClose();
                    }}
                    extraButtons={
                        <IconButton
                            aria-label="Download"
                            variant="ghost"
                            fontSize="20px"
                            color="gray.500"
                            icon={<RiDownload2Line />}
                            isDisabled={functionLoading || !func}
                            onClick={downloadFunction}
                        />
                    }
                    updateNameButton={updateNameButton}
                    updateNameDialog={updateNameDialog}
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
                            value={func?.key}
                            loading={functionLoading}
                        />
                        <DrawerSectionDateEntry
                            title="Created"
                            date={func?.creation_date}
                            loading={functionLoading}
                        />
                        <OrganizationDrawerSectionEntry
                            title="Owner"
                            loading={functionLoading}
                            organization={func?.owner}
                        />
                        <PermissionsDrawerSectionEntry
                            loading={functionLoading}
                            permission={func?.permissions.process}
                        />
                    </DrawerSection>
                    <InputsOutputsDrawerSection
                        loading={functionLoading}
                        func={func}
                        type="inputs"
                    />
                    <InputsOutputsDrawerSection
                        loading={functionLoading}
                        func={func}
                        type="outputs"
                    />
                    <MetadataDrawerSection
                        metadata={func?.metadata}
                        loading={functionLoading}
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

export default FunctionDrawer;