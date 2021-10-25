import { Button, VStack } from '@chakra-ui/react';
import { RiDownloadLine } from 'react-icons/ri';

import { getHeadModel, getSimpleModel } from '@/modules/tasks/ModelsUtils';
import {
    Aggregatetuple,
    CompositeTraintuple,
    Traintuple,
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

    const simpleModel = getSimpleModel(task);
    const headModel = getHeadModel(task);

    return (
        <TableDrawerSectionEntry
            title={isCompositeTraintuple(task) ? 'Out models' : 'Out model'}
        >
            {(isTraintuple(task) || isAggregatetuple(task)) &&
                (simpleModel?.address?.storage_address &&
                canDownloadModel(simpleModel.permissions) ? (
                    <DownloadIconButton
                        variant="ghost"
                        storageAddress={simpleModel.address.storage_address}
                        filename={`model_${simpleModel.key}`}
                        label="Download out model"
                    />
                ) : (
                    'N/A'
                ))}
            {isCompositeTraintuple(task) && (
                <VStack spacing="1" alignItems="flex-end">
                    {headModel?.address?.storage_address &&
                        canDownloadModel(headModel.permissions) && (
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    downloadFromApi(
                                        headModel.address?.storage_address ||
                                            '',
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
                        )}
                    {simpleModel?.address?.storage_address &&
                        canDownloadModel(simpleModel.permissions) && (
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    downloadFromApi(
                                        simpleModel.address?.storage_address ||
                                            '',
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
                        )}
                </VStack>
            )}
        </TableDrawerSectionEntry>
    );
};

export default TableDrawerSectionOutModelEntry;
