import { Text, HStack } from '@chakra-ui/react';

import useCanDownloadModel from '@/hooks/useCanDownloadModel';
import {
    isAggregatetuple,
    isCompositeTraintuple,
    isTraintuple,
} from '@/libs/tuples';
import { getHeadModel, getSimpleModel } from '@/modules/tasks/ModelsUtils';
import {
    AggregatetupleT,
    CompositeTraintupleT,
    TraintupleT,
    TupleStatus,
} from '@/modules/tasks/TuplesTypes';

import DownloadIconButton from '@/components/DownloadIconButton';

const DrawerSectionOutModelEntryContent = ({
    task,
}: {
    task: TraintupleT | AggregatetupleT | CompositeTraintupleT;
}): JSX.Element | null => {
    const canDownloadModel = useCanDownloadModel();

    let content = null;

    if (task.status === TupleStatus.waiting) {
        content = (
            <Text color="gray.500">Model training hasn't started yet</Text>
        );
    } else if (task.status === TupleStatus.todo) {
        content = (
            <Text color="gray.500">Model training hasn't started yet</Text>
        );
    } else if (task.status === TupleStatus.doing) {
        content = <Text color="gray.500">Model still training</Text>;
    } else if (task.status === TupleStatus.failed) {
        content = <Text color="gray.500">Model training failed</Text>;
    } else if (task.status === TupleStatus.canceled) {
        content = <Text color="gray.500">Model training canceled</Text>;
    } else if (task.status === TupleStatus.done) {
        const simpleModel = getSimpleModel(task);
        const headModel = getHeadModel(task);

        if (simpleModel && !canDownloadModel(simpleModel.permissions)) {
            content = (
                <Text color="gray.500">
                    Not enough permissions to see the model or missing required
                    configuration on the server.
                </Text>
            );
        } else if (!simpleModel?.address?.storage_address) {
            content = <Text color="gray.500">Intermediary model deleted</Text>;
        } else if (
            (isTraintuple(task) || isAggregatetuple(task)) &&
            simpleModel
        ) {
            content = (
                <HStack spacing="1.5">
                    <Text>Model</Text>
                    <DownloadIconButton
                        storageAddress={simpleModel.address.storage_address}
                        filename={`model_${simpleModel.key}`}
                        aria-label="Download model"
                        size="xs"
                        placement="top"
                    />
                </HStack>
            );
        } else if (isCompositeTraintuple(task) && simpleModel && headModel) {
            content = (
                <HStack spacing="1">
                    <HStack spacing="1.5">
                        <Text>Head model</Text>
                        <DownloadIconButton
                            storageAddress={
                                headModel.address?.storage_address || ''
                            }
                            filename={`model_${headModel.key}`}
                            aria-label="Download head model"
                            size="xs"
                            placement="top"
                        />
                    </HStack>
                    <Text>,</Text>
                    <HStack spacing="1.5">
                        <Text>Trunk model</Text>
                        <DownloadIconButton
                            storageAddress={
                                simpleModel.address?.storage_address || ''
                            }
                            filename={`model_${simpleModel.key}`}
                            aria-label="Download trunk model"
                            size="xs"
                            placement="top"
                        />
                    </HStack>
                </HStack>
            );
        }
    }
    return content;
};

export default DrawerSectionOutModelEntryContent;
