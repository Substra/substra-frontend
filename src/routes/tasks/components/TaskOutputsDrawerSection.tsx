import { useEffect, useState } from 'react';

import { Box, HStack, Icon, Skeleton, Text } from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';

import * as TasksApi from '@/api/TasksApi';
import { getAllPages } from '@/api/request';
import { AssetKindT } from '@/types/FunctionsTypes';
import { ModelT } from '@/types/ModelsTypes';
import { TaskT, TaskStatus, TaskIOT, TaskOutputT } from '@/types/TasksTypes';

import { DrawerSection, DrawerSectionEntry } from '@/components/DrawerSection';

import { getTaskIOIcon, TaskIOTooltip } from '../TasksUtils';
import DrawerSectionOutModelEntryContent from './DrawerSectionOutModelEntryContent';

const displayPerformance = (value: number | null, taskStatus: TaskStatus) => {
    if (value === null) {
        let msg: string;
        if (taskStatus === TaskStatus.waitingBuilderSlot) {
            msg = "Computation hasn't started yet";
        } else if (
            taskStatus === TaskStatus.building ||
            taskStatus === TaskStatus.waitingParentTasks ||
            taskStatus === TaskStatus.waitingExecutorSlot ||
            taskStatus === TaskStatus.doing
        ) {
            msg = 'Computation is ongoing';
        } else if (taskStatus === TaskStatus.failed) {
            msg = 'Computation failed';
        } else if (taskStatus === TaskStatus.canceled) {
            msg = 'Computation canceled';
        } else {
            msg = 'Value not available';
        }
        return (
            <Text color="gray.400" fontSize="xs">
                {msg}
            </Text>
        );
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

const displayTransientItem = (taskStatus: TaskStatus) => {
    const isTaskDone = taskStatus === TaskStatus.done;
    return (
        <HStack flexGrow="1" justifyContent="flex-end">
            <Text color="gray.400" fontSize="xs">
                {isTaskDone ? 'No longer available' : 'Transient item'}
            </Text>
            <TaskIOTooltip label="Transient item are deleted after use to save storage">
                <Box as="span" display="flex" alignItems="center">
                    <Icon
                        as={RiInformationLine}
                        boxSize="14px"
                        color="gray.400"
                    />
                </Box>
            </TaskIOTooltip>
        </HStack>
    );
};

const TaskOutputRepresentation = ({
    kind,
    taskStatus,
    output,
    outputAsset,
}: {
    kind: AssetKindT;
    taskStatus: TaskStatus;
    output?: TaskOutputT;
    outputAsset?: TaskIOT;
}) => {
    let content;
    let value = null;

    if (output?.transient) {
        content = displayTransientItem(taskStatus);
    } else {
        if (kind === AssetKindT.model) {
            if (outputAsset?.kind === kind) {
                value = outputAsset.asset;
            }
            content = displayModel(value, taskStatus);
        } else if (kind === AssetKindT.performance) {
            if (outputAsset?.kind === kind) {
                value = outputAsset.asset.performance_value;
            }
            content = displayPerformance(value, taskStatus);
        } else {
            content = <Text color="gray.500">Value not available</Text>;
        }
    }

    return content;
};

const TaskOutputSectionEntry = ({
    identifier,
    kind,
    output,
    outputAsset,
    taskStatus,
}: {
    identifier: string;
    kind: AssetKindT;
    taskStatus: TaskStatus;
    output?: TaskOutputT;
    outputAsset?: TaskIOT;
}) => {
    const icon = getTaskIOIcon(kind);

    return (
        <DrawerSectionEntry
            icon={icon}
            title={identifier}
            titleStyle="code"
            alignItems="center"
        >
            <TaskOutputRepresentation
                kind={kind}
                taskStatus={taskStatus}
                output={output}
                outputAsset={outputAsset}
            />
        </DrawerSectionEntry>
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
    const [taskOutputsAssets, setTaskOutputsAssets] = useState<TaskIOT[]>([]);

    useEffect(() => {
        if (task) {
            getTaskOutputsAssets(task.key).then((result) =>
                setTaskOutputsAssets(result)
            );
        }
    }, [task]);

    const getOutputAsset = (identifier: string): TaskIOT => {
        return taskOutputsAssets.filter(
            (outputAsset) => outputAsset.identifier === identifier
        )[0];
    };

    return (
        <DrawerSection title="Outputs">
            {taskLoading || !task ? (
                <Skeleton height="50px" width="457px"></Skeleton>
            ) : (
                Object.keys(task.function.outputs).map((identifier) => {
                    return (
                        <TaskOutputSectionEntry
                            key={identifier}
                            identifier={identifier}
                            kind={task.function.outputs[identifier].kind}
                            taskStatus={task.status}
                            output={task?.outputs[identifier]}
                            outputAsset={getOutputAsset(identifier)}
                        />
                    );
                })
            )}
        </DrawerSection>
    );
};

export default TaskOutputsDrawerSection;
