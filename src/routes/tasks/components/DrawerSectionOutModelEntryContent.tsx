import { HStack, Text } from '@chakra-ui/react';

import useAuthStore from '@/features/auth/useAuthStore';
import useCanDownloadModel from '@/hooks/useCanDownloadModel';
import { ModelT } from '@/types/ModelsTypes';
import { TaskStatus } from '@/types/TasksTypes';

import DownloadIconButton from '@/components/DownloadIconButton';

const DrawerSectionOutModelEntryContent = ({
    model,
    taskStatus,
}: {
    model: ModelT | null;
    taskStatus: TaskStatus;
}): JSX.Element | null => {
    const {
        info: {
            config: { model_export_enabled: modelExportEnabled },
        },
    } = useAuthStore();
    const canDownloadModel = useCanDownloadModel();

    let content = null;

    if (taskStatus === TaskStatus.waitingBuilderSlot) {
        content = (
            <Text color="gray.500">Model training hasn't started yet</Text>
        );
    } else if (taskStatus === TaskStatus.building) {
        content = (
            <Text color="gray.500">Model training hasn't started yet</Text>
        );
    } else if (taskStatus === TaskStatus.waitingParentTasks) {
        content = <Text color="gray.500">Model waiting</Text>;
    } else if (taskStatus === TaskStatus.waitingExecutorSlot) {
        content = <Text color="gray.500">Model still training</Text>;
    } else if (taskStatus === TaskStatus.doing) {
        content = <Text color="gray.500">Model still training</Text>;
    } else if (taskStatus === TaskStatus.failed) {
        content = <Text color="gray.500">Model training failed</Text>;
    } else if (taskStatus === TaskStatus.canceled) {
        content = <Text color="gray.500">Model training canceled</Text>;
    } else if (taskStatus === TaskStatus.done) {
        if (model === null) {
            content = <Text color="gray.500">Model is not available</Text>;
        } else {
            const permissions = model.permissions;
            if (permissions && !canDownloadModel(permissions)) {
                content = (
                    <HStack flexGrow="1" justifyContent="flex-end">
                        <HStack flexGrow="1" justifyContent="flex-end">
                            <DownloadIconButton
                                filename={`model_${model.key}`}
                                aria-label={
                                    modelExportEnabled
                                        ? 'Restricted download'
                                        : 'Model export is not enabled'
                                }
                                size="xs"
                                placement="top"
                                disabled
                            />
                        </HStack>
                    </HStack>
                );
            } else if (!model.address?.storage_address) {
                content = (
                    <Text color="gray.500">
                        Intermediary model no longer available
                    </Text>
                );
            } else {
                content = (
                    <HStack flexGrow="1" justifyContent="flex-end">
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
