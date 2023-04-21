import { useEffect } from 'react';

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

import { downloadFromApi } from '@/api/request';
import useUpdateAssetName from '@/features/updateAsset/useUpdateAssetName';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import { PATHS } from '@/paths';
import DescriptionDrawerSection from '@/routes/functions/components/DescriptionDrawerSection';

import DrawerHeader from '@/components/DrawerHeader';
import {
    DrawerSection,
    DrawerSectionDateEntry,
    DrawerSectionKeyEntry,
    OrganizationDrawerSectionEntry,
    PermissionsDrawerSectionEntry,
} from '@/components/DrawerSection';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';

import useFunctionStore from '../useFunctionStore';
import InputsOutputsDrawerSection from './InputsOutputsDrawerSection';

const FunctionDrawer = (): JSX.Element => {
    const setLocationPreserveParams = useSetLocationPreserveParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const key = useKeyFromPath(PATHS.FUNCTION);

    const {
        function: func,
        description,
        fetchingFunction,
        fetchingDescription,
        updatingFunction,
        fetchFunction,
        fetchDescription,
        updateFunction,
    } = useFunctionStore();

    useEffect(() => {
        if (key) {
            if (!isOpen) {
                onOpen();

                const fetchAll = async () => {
                    const func = await fetchFunction(key);

                    if (func) {
                        fetchDescription(func.description.storage_address);
                    }
                };

                fetchAll();
            }
        }
    }, [fetchFunction, fetchDescription, isOpen, key, onOpen]);

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

    const { updateNameDialog, updateNameButton } = useUpdateAssetName({
        dialogTitle: 'Rename function',
        asset: func,
        updatingAsset: updatingFunction,
        updateAsset: updateFunction,
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
                    loading={fetchingFunction}
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
                            isDisabled={fetchingFunction || !func}
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
                            loading={fetchingFunction}
                        />
                        <DrawerSectionDateEntry
                            title="Created"
                            date={func?.creation_date}
                            loading={fetchingFunction}
                        />
                        <OrganizationDrawerSectionEntry
                            title="Owner"
                            loading={fetchingFunction}
                            organization={func?.owner}
                        />
                        <PermissionsDrawerSectionEntry
                            loading={fetchingFunction}
                            permission={func?.permissions.process}
                        />
                    </DrawerSection>
                    <InputsOutputsDrawerSection
                        loading={fetchingFunction}
                        func={func}
                        type="inputs"
                    />
                    <InputsOutputsDrawerSection
                        loading={fetchingFunction}
                        func={func}
                        type="outputs"
                    />
                    <MetadataDrawerSection
                        metadata={func?.metadata}
                        loading={fetchingFunction}
                    />
                    <DescriptionDrawerSection
                        loading={fetchingDescription}
                        description={description}
                    />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default FunctionDrawer;
