import { useEffect, useState } from 'react';

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
import {
    AllStepsT,
    ExecutionRundownT,
    StepInfoT,
    StepT,
} from '@/types/ProfilingTypes';

import { DrawerSectionHeading } from '@/components/DrawerSection';

type DetailsItemProps = {
    duration: number | undefined;
    stepInfo: StepInfoT;
};

const ProfilingDetailsItem = ({
    duration,
    stepInfo,
}: DetailsItemProps): JSX.Element => {
    const { color, title, description } = stepInfo;
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

const ProfilingDetails = <TaskType extends AllStepsT>({
    execution_rundown,
    stepsInfo,
}: ExecutionRundownT<TaskType> & {
    stepsInfo: Record<TaskType, StepInfoT>;
}): JSX.Element => {
    const items = [];
    for (const step in stepsInfo) {
        const duration = execution_rundown.filter(
            (execStep) => execStep.step === step
        )[0]?.duration;
        items.push(
            <ProfilingDetailsItem
                key={step}
                stepInfo={stepsInfo[step]}
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

const ProfilingDurationBar = <TaskType extends AllStepsT>({
    execution_rundown,
    duration,
    stepsInfo,
    loading = false,
}: ExecutionRundownT<TaskType> & {
    duration: number | null;
    stepsInfo: Record<TaskType, StepInfoT>;
    loading?: boolean;
}): JSX.Element => {
    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: false,
    });

    const [sortedExecutionRundown, setSortedExecutionRundown] = useState<
        StepT<TaskType>[]
    >([]);

    useEffect(() => {
        const newRundown = [];

        for (const step in stepsInfo) {
            const newStep = execution_rundown.find(
                (exec) => exec.step === step
            );
            if (newStep) {
                newRundown.push(newStep);
            }
        }

        setSortedExecutionRundown(newRundown);
    }, [execution_rundown, stepsInfo]);

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
                            {duration ? formatCompactDuration(duration) : '--'}
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
                {sortedExecutionRundown.length > 0 ? (
                    <HStack
                        spacing="2px"
                        width="100%"
                        height="4px"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        backgroundColor="gray.100"
                        borderRadius="20px"
                    >
                        {sortedExecutionRundown.map((exec) => {
                            const { color, title } = stepsInfo[exec.step];
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
                    <ProfilingDetails
                        stepsInfo={stepsInfo}
                        execution_rundown={sortedExecutionRundown}
                    />
                </Box>
            </Collapse>
        </Box>
    );
};

export default ProfilingDurationBar;
