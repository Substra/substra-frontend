import { useEffect } from 'react';

import {
    Box,
    HStack,
    VStack,
    Text,
    useDisclosure,
    Icon,
    Collapse,
    Heading,
    Tooltip,
    Skeleton,
} from '@chakra-ui/react';
import {
    RiArrowRightSLine,
    RiErrorWarningLine,
    RiInformationLine,
} from 'react-icons/ri';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import {
    formatDjangoFormatDuration,
    parseNumberDjangoFormatDuration,
} from '@/libs/utils';
import { retrieveTaskProfiling } from '@/modules/tasks/TasksSlice';
import { StepT, TaskProfilingT, TaskStep } from '@/modules/tasks/TasksTypes';
import { getStepInfo } from '@/modules/tasks/TasksUtils';

import { DrawerSectionHeading } from '@/components/DrawerSection';

type DetailsItemProps = {
    step: TaskStep;
    duration: string | null;
};

const DetailsItem = ({ step, duration }: DetailsItemProps): JSX.Element => {
    const { color, title, description } = getStepInfo(step);
    return (
        <HStack width="100%" justify="space-between">
            <HStack spacing="1">
                <Box
                    width="12px"
                    height="12px"
                    backgroundColor={color}
                    borderRadius="2px"
                />
                <Text fontSize="xs">{title}</Text>
                <Tooltip
                    label={description}
                    fontSize="xs"
                    hasArrow={true}
                    placement="top"
                >
                    {/* Have to use a span here to fix buggy behavior between tooltip & icon in Chakra */}
                    <Box as="span" display="flex" alignItems="center">
                        <Icon as={RiInformationLine} boxSize="14px" />
                    </Box>
                </Tooltip>
            </HStack>
            <Text fontSize="xs">
                {duration ? formatDjangoFormatDuration(duration) : '-'}
            </Text>
        </HStack>
    );
};

type TaskDurationDetailsProps = {
    execution_rundown: StepT[] | undefined;
};
const TaskDurationDetails = ({
    execution_rundown,
}: TaskDurationDetailsProps): JSX.Element => {
    return (
        <VStack spacing="1" alignItems="start">
            {Object.values(TaskStep).map((taskStep) => {
                let duration = null;
                if (execution_rundown) {
                    duration = execution_rundown.filter(
                        (execStep) => execStep.step === taskStep
                    )[0]?.duration;
                }
                return (
                    <DetailsItem
                        key={taskStep}
                        step={taskStep}
                        duration={duration}
                    />
                );
            })}
        </VStack>
    );
};

type DurationItemProps = {
    color: string;
    title: string;
    duration: string;
    taskDuration: number | null;
};

const DurationItem = ({
    color,
    title,
    duration,
    taskDuration,
}: DurationItemProps): JSX.Element | null => {
    if (!taskDuration) {
        return null;
    }

    const stepDuration = parseNumberDjangoFormatDuration(duration);
    const percentage = Math.round((stepDuration / taskDuration) * 100);

    return (
        <Tooltip
            label={`${title}: ${formatDjangoFormatDuration(duration)}`}
            fontSize="xs"
            hasArrow={true}
            placement="top"
        >
            <Box
                minWidth="4px"
                flexBasis={`${percentage}%`}
                backgroundColor={color}
                borderRadius="20px"
            />
        </Tooltip>
    );
};

// Returns task duration if task is over, otherwise sum duration of all step currently done
// Returns null if no step is done
const getTaskDuration = (
    taskProfiling: TaskProfilingT | null
): number | null => {
    if (!taskProfiling || taskProfiling.execution_rundown.length === 0) {
        return null;
    }
    if (taskProfiling.task_duration) {
        return parseNumberDjangoFormatDuration(taskProfiling.task_duration);
    }

    return taskProfiling.execution_rundown.reduce(
        (taskDuration, step) =>
            taskDuration + parseNumberDjangoFormatDuration(step.duration),
        0
    );
};

const TaskDurationBar = ({
    taskKey,
}: {
    taskKey: string | null | undefined;
}): JSX.Element => {
    const dispatch = useAppDispatch();

    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: false,
    });

    const taskProfiling = useAppSelector((state) => state.tasks.taskProfiling);
    const taskProfilingLoading = useAppSelector(
        (state) => state.tasks.taskProfilingLoading
    );

    const taskDuration = getTaskDuration(taskProfiling);

    useEffect(() => {
        if (taskKey) {
            dispatch(retrieveTaskProfiling(taskKey));
        }
    }, [dispatch, taskKey]);

    if (taskProfilingLoading) {
        return (
            <VStack spacing="1" width="100%" alignItems="flex-start">
                <DrawerSectionHeading title="Duration" />
                <Skeleton height="4" width="100%" />
            </VStack>
        );
    }

    return (
        <Box fontSize="xs" paddingY="4" width="100%">
            <VStack spacing="1" alignItems="start">
                <HStack
                    spacing="2"
                    width="100%"
                    alignItems="center"
                    justify="space-between"
                    cursor="pointer"
                    onClick={onToggle}
                >
                    <HStack spacing="1">
                        <DrawerSectionHeading title="Duration" />
                        <Tooltip
                            label="This is an experimental feature. The sum of task's steps durations might not be equal to the task duration."
                            fontSize="xs"
                            hasArrow={true}
                            placement="top"
                        >
                            {/* Have to use a span here to fix buggy behavior between tooltip & icon in Chakra */}
                            <Box as="span" display="flex" alignItems="center">
                                <Icon as={RiErrorWarningLine} boxSize="14px" />
                            </Box>
                        </Tooltip>
                    </HStack>
                    <HStack spacing="2" alignItems="center">
                        <Heading size="xxs">
                            {taskProfiling?.task_duration
                                ? formatDjangoFormatDuration(
                                      taskProfiling.task_duration
                                  )
                                : '--'}
                        </Heading>
                        <Icon
                            as={RiArrowRightSLine}
                            width="16px"
                            height="16px"
                            transform={isOpen ? 'rotate(90deg)' : ''}
                            alignSelf="center"
                            fill="primary.600"
                        />
                    </HStack>
                </HStack>
                {taskProfiling && taskProfiling.execution_rundown.length > 0 ? (
                    <HStack
                        spacing="2px"
                        width="100%"
                        height="4px"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        backgroundColor="gray.100"
                        borderRadius="20px"
                    >
                        {taskProfiling.execution_rundown.map((exec) => {
                            const { color, title } = getStepInfo(exec.step);
                            return (
                                <DurationItem
                                    key={exec.step}
                                    color={color || 'gray.100'}
                                    title={title}
                                    duration={exec.duration}
                                    taskDuration={taskDuration}
                                />
                            );
                        })}
                    </HStack>
                ) : (
                    <HStack
                        width="100%"
                        height="4px"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        backgroundColor="gray.100"
                        borderRadius="20px"
                    />
                )}
            </VStack>
            <Collapse in={isOpen} animateOpacity>
                <Box paddingRight="4" marginTop="2.5">
                    <TaskDurationDetails
                        execution_rundown={taskProfiling?.execution_rundown}
                    />
                </Box>
            </Collapse>
        </Box>
    );
};

export default TaskDurationBar;
