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

import { formatCompactDuration } from '@/libs/utils';
import { getStepInfo, taskOrder } from '@/routes/tasks/TasksUtils';
import { ExecutionRundownT, TaskStep } from '@/types/ProfilingTypes';

import { DrawerSectionHeading } from '@/components/DrawerSection';

type DetailsItemProps = {
    step: TaskStep;
    duration: number | null;
};

const ProfilingDetailsItem = ({
    step,
    duration,
}: DetailsItemProps): JSX.Element => {
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
                {duration ? formatCompactDuration(duration / 1000000) : '-'}
            </Text>
        </HStack>
    );
};

const ProfilingDetails = ({
    execution_rundown,
}: ExecutionRundownT): JSX.Element => {
    const items = [];
    for (const taskStep of taskOrder.keys()) {
        const duration = execution_rundown.filter(
            (execStep) => execStep.step === taskStep
        )[0]?.duration;
        items.push(
            <ProfilingDetailsItem
                key={taskStep}
                step={taskStep}
                duration={duration}
            />
        );
    }
    return (
        <VStack spacing="1" alignItems="start">
            {items}
        </VStack>
    );
};

type DurationItemProps = {
    color: string;
    title: string;
    duration: number;
    totalDuration: number | null;
};

const DurationItem = ({
    color,
    title,
    duration,
    totalDuration,
}: DurationItemProps): JSX.Element | null => {
    if (!totalDuration) {
        return null;
    }

    // format duration in seconds
    const stepDuration = duration / 1000000;
    const percentage = Math.round((stepDuration / totalDuration) * 100);

    return (
        <Tooltip
            label={`${title}: ${formatCompactDuration(stepDuration)}`}
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

const ProfilingDurationBar = ({
    execution_rundown,
    duration,
    loading = false,
}: ExecutionRundownT & {
    duration: number | null;
    loading?: boolean;
}): JSX.Element => {
    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: false,
    });

    if (loading) {
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
                            {duration
                                ? formatCompactDuration(duration / 1000000)
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
                {execution_rundown.length > 0 ? (
                    <HStack
                        spacing="2px"
                        width="100%"
                        height="4px"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        backgroundColor="gray.100"
                        borderRadius="20px"
                    >
                        {execution_rundown.map((exec) => {
                            const { color, title } = getStepInfo(exec.step);
                            return (
                                <DurationItem
                                    key={exec.step}
                                    color={color || 'gray.100'}
                                    title={title}
                                    duration={exec.duration}
                                    totalDuration={duration}
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
                    <ProfilingDetails execution_rundown={execution_rundown} />
                </Box>
            </Collapse>
        </Box>
    );
};

export default ProfilingDurationBar;
