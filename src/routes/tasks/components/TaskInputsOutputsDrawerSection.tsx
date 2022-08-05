import {
    TableContainer,
    Table,
    Text,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Code,
    Skeleton,
} from '@chakra-ui/react';

import { capitalize } from '@/libs/utils';
import { InputT } from '@/modules/algos/AlgosTypes';
import { getAssetKindLabel } from '@/modules/algos/AlgosUtils';
import { ModelT } from '@/modules/tasks/ModelsTypes';
import { AnyTupleT, TupleStatus } from '@/modules/tasks/TuplesTypes';

import { DrawerSection } from '@/components/DrawerSection';

import DrawerSectionOutModelEntryContent from './DrawerSectionOutModelEntryContent';

const getOutputKind = (task: AnyTupleT, output_id: string) => {
    return task.algo.outputs[output_id].kind;
};

const isMultipleOutput = (task: AnyTupleT, output_id: string) => {
    return task.algo.outputs[output_id].multiple;
};

const displayPerformance = (value: number, taskStatus: TupleStatus) => {
    if (value === null) {
        let msg: string;
        if (
            taskStatus === TupleStatus.waiting ||
            taskStatus === TupleStatus.todo
        ) {
            msg = "computation hasn't started yet";
        } else if (taskStatus === TupleStatus.doing) {
            msg = 'computation is ongoing';
        } else if (taskStatus === TupleStatus.failed) {
            msg = 'computation failed';
        } else if (taskStatus === TupleStatus.canceled) {
            msg = 'computation canceled';
        } else {
            msg = 'Value not available';
        }
        return <Text>{msg}</Text>;
    } else {
        return <>{value.toFixed(3)}</>;
    }
};

const displayModel = (value: ModelT | null, taskStatus: TupleStatus) => {
    return (
        <DrawerSectionOutModelEntryContent
            taskStatus={taskStatus}
            model={value}
        />
    );
};

const TaskInputsOutputsDrawerSection = ({
    loading,
    task,
    type,
}: {
    loading: boolean;
    task: AnyTupleT | null;
    type: 'inputs' | 'outputs';
}) => {
    return (
        <DrawerSection title={capitalize(type)}>
            <TableContainer alignSelf="stretch">
                <Table size="md" width="100%" fontSize="xs">
                    <Thead>
                        <Tr>
                            <Th width="100%" />
                            <Th>Kind</Th>
                            {type === 'inputs' && <Th>Optional</Th>}
                            <Th paddingRight="0 !important">Multiple</Th>
                            <Th>Value</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {(loading || !task) &&
                            [0, 1, 2].map((key) => (
                                <Tr key={key}>
                                    <Td paddingLeft="0 !important">
                                        <Skeleton>Dummy</Skeleton>
                                    </Td>
                                    <Td>
                                        <Skeleton>Dummy</Skeleton>
                                    </Td>
                                    {type === 'inputs' && (
                                        <Td>
                                            <Skeleton>yes</Skeleton>
                                        </Td>
                                    )}
                                    <Td
                                        paddingRight="0 !important"
                                        textAlign="center"
                                    >
                                        <Skeleton>yes</Skeleton>
                                    </Td>
                                    <Td>
                                        <Skeleton>Dummy</Skeleton>
                                    </Td>
                                </Tr>
                            ))}
                        {!loading &&
                            task &&
                            Object.entries(task[type]).map(([key, input]) => {
                                const kind = getOutputKind(task, key);
                                const multiple = isMultipleOutput(task, key);
                                return (
                                    <Tr key={key}>
                                        <Td paddingLeft="0 !important">
                                            <Code fontSize="xs">{key}</Code>
                                        </Td>
                                        <Td>{getAssetKindLabel(kind)}</Td>
                                        {type === 'inputs' && (
                                            <Td textAlign="center">
                                                {(input as InputT).optional
                                                    ? 'yes'
                                                    : 'no'}
                                            </Td>
                                        )}
                                        <Td
                                            paddingRight="0 !important"
                                            textAlign="center"
                                        >
                                            {multiple ? 'yes' : 'no'}
                                        </Td>
                                        <Td textAlign="center">
                                            {kind === 'ASSET_PERFORMANCE' &&
                                                displayPerformance(
                                                    input.value,
                                                    task.status
                                                )}
                                            {kind === 'ASSET_MODEL' &&
                                                displayModel(
                                                    input.value,
                                                    task.status
                                                )}
                                        </Td>
                                    </Tr>
                                );
                            })}
                    </Tbody>
                </Table>
            </TableContainer>
        </DrawerSection>
    );
};

export default TaskInputsOutputsDrawerSection;
