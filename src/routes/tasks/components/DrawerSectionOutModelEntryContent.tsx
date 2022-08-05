import { Icon, HStack, Text, Tooltip } from '@chakra-ui/react';
import { RiEyeOffLine } from 'react-icons/ri';

import useCanDownloadModel from '@/hooks/useCanDownloadModel';
import { ModelT } from '@/modules/tasks/ModelsTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import DownloadIconButton from '@/components/DownloadIconButton';

const DrawerSectionOutModelEntryContent = ({
    model,
    taskStatus,
}: {
    model: ModelT | null;
    taskStatus: TupleStatus;
}): JSX.Element | null => {
    const canDownloadModel = useCanDownloadModel();

    let content = null;

    if (taskStatus === TupleStatus.waiting) {
        content = (
            <Text color="gray.500">Model training hasn't started yet</Text>
        );
    } else if (taskStatus === TupleStatus.todo) {
        content = (
            <Text color="gray.500">Model training hasn't started yet</Text>
        );
    } else if (taskStatus === TupleStatus.doing) {
        content = <Text color="gray.500">Model still training</Text>;
    } else if (taskStatus === TupleStatus.failed) {
        content = <Text color="gray.500">Model training failed</Text>;
    } else if (taskStatus === TupleStatus.canceled) {
        content = <Text color="gray.500">Model training canceled</Text>;
    } else if (taskStatus === TupleStatus.done) {
        if (model === null) {
            content = <Text color="gray.500">Model is not available</Text>;
        } else {
            const permissions = model.permissions;
            if (permissions && !canDownloadModel(permissions)) {
                content = (
                    <Tooltip
                        label="Not enough permissions to see the model or missing required
                configuration on the server."
                        fontSize="xs"
                        hasArrow
                        placement="top"
                        shouldWrapChildren
                    >
                        <Icon color="gray.500" as={RiEyeOffLine} />
                    </Tooltip>
                );
            } else if (!model.address?.storage_address) {
                content = (
                    <Text color="gray.500">
                        Intermediary model no longer available
                    </Text>
                );
            } else {
                content = (
                    <HStack spacing="1.5">
                        <Text>Model</Text>
                        <DownloadIconButton
                            storageAddress={model.address.storage_address}
                            filename={`model_${model.key}`}
                            aria-label="Download model"
                            size="xs"
                            placement="top"
                        />
                    </HStack>
                );
            }
        }
    }
    return content;
};

export default DrawerSectionOutModelEntryContent;
