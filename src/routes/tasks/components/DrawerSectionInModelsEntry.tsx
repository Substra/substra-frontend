import {
    HStack,
    Icon,
    List,
    ListItem,
    Skeleton,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import { RiDatabase2Line, RiLockLine } from 'react-icons/ri';

import AngleIcon from '@/assets/svg/angle-icon.svg';
import useCanDownloadModel from '@/hooks/useCanDownloadModel';
import { TaskInputT } from '@/modules/tasks/TuplesTypes';

import DownloadIconButton from '@/components/DownloadIconButton';
import {
    DrawerSectionCollapsibleEntry,
    DrawerSectionEntry,
} from '@/components/DrawerSection';
import IconTag from '@/components/IconTag';

const InModelContent = ({
    model,
}: {
    model: TaskInputT;
}): JSX.Element | null => {
    const canDownloadModel = useCanDownloadModel();
    const permissions = model.permissions;
    let content = null;

    if (permissions && !canDownloadModel(permissions)) {
        content = (
            <HStack spacing="1.5">
                <Text as="span" fontSize="xs" lineHeight="4">
                    {model.identifier}
                </Text>
                <Tooltip
                    label="Not enough permissions to see the model or missing required
                configuration on the server."
                    fontSize="xs"
                    hasArrow
                    placement="top"
                    shouldWrapChildren
                >
                    <Icon color="gray.500" as={RiLockLine} />
                </Tooltip>
            </HStack>
        );
    } else if (!model.addressable?.storage_address) {
        content = (
            <Text color="gray.500">Intermediary model no longer available</Text>
        );
    } else {
        content = (
            <HStack spacing="1.5">
                <Text>{model.identifier}</Text>
                <DownloadIconButton
                    storageAddress={model.addressable.storage_address}
                    filename={`model_${model.identifier}`}
                    aria-label="Download model"
                    size="xs"
                    placement="top"
                />
            </HStack>
        );
    }

    return content;
};

const DrawerSectionInModelsEntry = ({
    loading,
    models,
}: {
    loading: boolean;
    models: TaskInputT[] | undefined;
}): JSX.Element => {
    return (
        <>
            {(loading || !models) && <Skeleton height="4" width="250px" />}

            {!loading && models && models.length === 1 && (
                <DrawerSectionEntry title="Model">
                    <InModelContent model={models[0]} />
                </DrawerSectionEntry>
            )}

            {!loading && models && models.length > 1 && (
                <DrawerSectionCollapsibleEntry
                    title="Models"
                    aboveFold={
                        <Text color="gray.500">{models.length} models</Text>
                    }
                >
                    <List spacing={2.5}>
                        {models.map((model) => {
                            return (
                                <ListItem key={model.identifier}>
                                    <HStack spacing="2.5">
                                        <AngleIcon />
                                        <IconTag
                                            icon={RiDatabase2Line}
                                            backgroundColor="gray.100"
                                            fill="gray.500"
                                        />
                                        <InModelContent model={model} />
                                    </HStack>
                                </ListItem>
                            );
                        })}
                    </List>
                </DrawerSectionCollapsibleEntry>
            )}
        </>
    );
};

export default DrawerSectionInModelsEntry;
