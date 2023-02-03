import { useEffect, useState } from 'react';

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

import useKeyFromPath from '@/hooks/useKeyFromPath';
import { getAssetKindLabel } from '@/modules/functions/FunctionsUtils';
import { getAllPages } from '@/modules/common/CommonUtils';
import { ModelT } from '@/modules/tasks/ModelsTypes';
import * as TasksApi from '@/modules/tasks/TasksApi';
import { TaskT, TaskStatus, TaskIOT } from '@/modules/tasks/TasksTypes';
import { PATHS } from '@/paths';

import { DrawerSection } from '@/components/DrawerSection';

import DrawerSectionOutModelEntryContent from './DrawerSectionOutModelEntryContent';

const isMultipleOutput = (task: TaskT, output_id: string) => {
    return task.function.outputs[output_id].multiple;
};

const displayPerformance = (value: number, taskStatus: TaskStatus) => {
    if (value === null) {
        let msg: string;
        if (
            taskStatus === TaskStatus.waiting ||
            taskStatus === TaskStatus.todo
        ) {
            msg = "computation hasn't started yet";
        } else if (taskStatus === TaskStatus.doing) {
            msg = 'computation is ongoing';
        } else if (taskStatus === TaskStatus.failed) {
            msg = 'computation failed';
        } else if (taskStatus === TaskStatus.canceled) {
            msg = 'computation canceled';
        } else {
            msg = 'Value not available';
        }
        return <Text>{msg}</Text>;
    } else {
        return <>{value.toFixed(3)}</>;
    }
};

const displayModel = (value: ModelT | null, taskStatus: TaskStatus) => {
    return (
        <DrawerSectionOutModelEntryContent
            taskStatus={taskStatus}
            model={value}
        />
    );
};

const getTaskOutputsAssets = async (key: string): Promise<TaskIOT[]> => {
    const pageSize = 30;

    const taskOutputsAssets = await getAllPages(
        (page) =>
            TasksApi.listTaskOutputAssets(
                key,
                {
                    page,
                    pageSize,
                },
                {}
            ),
        pageSize
    );

    return taskOutputsAssets;
};

const TaskOutputsDrawerSection = ({
    taskLoading,
    task,
}: {
    taskLoading: boolean;
    task: TaskT | null;
}) => {
    const key = useKeyFromPath(PATHS.TASK);
    const [taskOutputsAssets, setTaskOutputsAssets] = useState<TaskIOT[]>([]);

    useEffect(() => {
        if (key) {
            getTaskOutputsAssets(key).then((result) =>
                setTaskOutputsAssets(result)
            );
        }
    }, [key]);

    return (
        <DrawerSection title="Outputs">
            <TableContainer alignSelf="stretch">
                <Table size="md" width="100%" fontSize="xs">
                    <Thead>
                        <Tr>
                            <Th width="100%" />
                            <Th>Kind</Th>
                            <Th paddingRight="0 !important">Multiple</Th>
                            <Th>Value</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {(taskLoading || !task) &&
                            [0, 1, 2].map((key) => (
                                <Tr key={key}>
                                    <Td paddingLeft="0 !important">
                                        <Skeleton>Dummy</Skeleton>
                                    </Td>
                                    <Td>
                                        <Skeleton>Dummy</Skeleton>
                                    </Td>
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
                        {!taskLoading &&
                            task &&
                            Object.values(taskOutputsAssets).map((output) => {
                                const multiple = isMultipleOutput(
                                    task,
                                    output.identifier
                                );
                                return (
                                    <Tr key={output.identifier}>
                                        <Td paddingLeft="0 !important">
                                            <Code fontSize="xs">
                                                {output.identifier}
                                            </Code>
                                        </Td>
                                        <Td>
                                            {getAssetKindLabel(output.kind)}
                                        </Td>
                                        <Td
                                            paddingRight="0 !important"
                                            textAlign="center"
                                        >
                                            {multiple ? 'yes' : 'no'}
                                        </Td>
                                        <Td textAlign="center">
                                            {output.kind ===
                                                'ASSET_PERFORMANCE' &&
                                                displayPerformance(
                                                    output.asset
                                                        .performance_value as number,
                                                    task.status
                                                )}
                                            {output.kind === 'ASSET_MODEL' &&
                                                displayModel(
                                                    output.asset as ModelT | null,
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

export default TaskOutputsDrawerSection;
