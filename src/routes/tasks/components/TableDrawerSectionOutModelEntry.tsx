import { Button, VStack } from '@chakra-ui/react';
import { RiDownloadLine } from 'react-icons/ri';

import { getHeadModel, getSimpleModel } from '@/modules/tasks/ModelsUtils';
import {
    Aggregatetuple,
    CompositeTraintuple,
    Traintuple,
    TupleStatus,
} from '@/modules/tasks/TuplesTypes';

import { downloadFromApi } from '@/libs/request';
import {
    isAggregatetuple,
    isCompositeTraintuple,
    isTraintuple,
} from '@/libs/tuples';

import useCanDownloadModel from '@/hooks/useCanDownloadModel';

import DownloadIconButton from '@/components/DownloadIconButton';
import { TableDrawerSectionEntry } from '@/components/TableDrawerSection';

const TableDrawerSectionOutModelEntry = ({
    task,
}: {
    task: Traintuple | Aggregatetuple | CompositeTraintuple;
}): JSX.Element => {
    const canDownloadModel = useCanDownloadModel();

    let content = null;

    if (task.status === TupleStatus.waiting) {
        content = "Model training hasn't started yet";
    } else if (task.status === TupleStatus.todo) {
        content = "Model training hasn't started yet";
    } else if (task.status === TupleStatus.doing) {
        content = 'Model still training';
    } else if (task.status === TupleStatus.failed) {
        content = 'Model training failed';
    } else if (task.status === TupleStatus.canceled) {
        content = 'Model training canceled';
    } else if (task.status === TupleStatus.done) {
        const simpleModel = getSimpleModel(task);
        const headModel = getHeadModel(task);

        if (simpleModel && !canDownloadModel(simpleModel.permissions)) {
            content =
                'Not enough permissions to see the simpleModel or missing required configuration on the server';
        } else if (!simpleModel?.address?.storage_address) {
            content = 'Intermediary simpleModel no longer available';
        } else if (
            (isTraintuple(task) || isAggregatetuple(task)) &&
            simpleModel
        ) {
            content = (
                <DownloadIconButton
                    variant="ghost"
                    storageAddress={simpleModel.address.storage_address}
                    filename={`simpleModel_${simpleModel.key}`}
                    label="Download out simpleModel"
                />
            );
        } else if (isCompositeTraintuple(task) && simpleModel && headModel) {
            content = (
                <VStack spacing="1" alignItems="flex-end">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            downloadFromApi(
                                headModel.address?.storage_address || '',
                                `model_${headModel.key}`
                            )
                        }
                        rightIcon={<RiDownloadLine />}
                        size="xs"
                        fontWeight="normal"
                        color="teal.500"
                    >
                        Head
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            downloadFromApi(
                                simpleModel.address?.storage_address || '',
                                `model_${simpleModel.key}`
                            )
                        }
                        rightIcon={<RiDownloadLine />}
                        size="xs"
                        fontWeight="normal"
                        color="teal.500"
                    >
                        Trunk
                    </Button>
                </VStack>
            );
        }
    }
    return (
        <TableDrawerSectionEntry
            title={isCompositeTraintuple(task) ? 'Out models' : 'Out model'}
        >
            {content}
        </TableDrawerSectionEntry>
    );
};

export default TableDrawerSectionOutModelEntry;
