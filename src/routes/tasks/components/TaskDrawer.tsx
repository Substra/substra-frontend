import { useEffect } from 'react';

import {
    Drawer,
    DrawerContent,
    DrawerOverlay,
    useDisclosure,
    DrawerBody,
    VStack,
    Link,
    Text,
    Box,
    Skeleton,
} from '@chakra-ui/react';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import {
    isAggregatetuple,
    isCompositeTraintuple,
    isTesttuple,
    isTraintuple,
} from '@/libs/tuples';
import { retrieveTask } from '@/modules/tasks/TasksSlice';
import {
    CATEGORY_LABEL,
    getPerf,
    getTaskCategory,
    getTaskDataSampleKeys,
    getTaskDataset,
} from '@/modules/tasks/TasksUtils';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/routes';

import DrawerHeader from '@/components/DrawerHeader';
import {
    DrawerSection,
    DrawerSectionEntry,
    DrawerSectionDateEntry,
    DrawerSectionKeyEntry,
    DRAWER_SECTION_ENTRY_LINK_MAX_WIDTH,
    DrawerSectionEntryWrapper,
} from '@/components/DrawerSection';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';
import Status from '@/components/Status';
import Timing from '@/components/Timing';

import DrawerSectionDatasetEntry from './DrawerSectionDatasetEntry';
import DrawerSectionMetricsEntry from './DrawerSectionMetricsEntry';
import DrawerSectionOutModelEntry from './DrawerSectionOutModelEntry';
import DrawerSectionParentTasksEntry from './DrawerSectionParentTasksEntry';
import DrawerSectionTestedModel from './DrawerSectionTestedModel';
import ErrorAlert from './ErrorAlert';

interface TaskDrawerProps {
    category: TaskCategory;
    onClose: () => void;
    taskKey: string | undefined | null;
    setPageTitle: boolean;
}

const TaskDrawer = ({
    category,
    onClose,
    taskKey,
    setPageTitle,
}: TaskDrawerProps): JSX.Element => {
    const { isOpen, onOpen, onClose: onDisclosureClose } = useDisclosure();

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (taskKey) {
            if (!isOpen) {
                onOpen();
                dispatch(retrieveTask({ category, key: taskKey }));
            }
        }
    }, [category, dispatch, isOpen, onOpen, taskKey]);

    const task = useAppSelector((state) => state.tasks.task);
    const taskLoading = useAppSelector((state) => state.tasks.taskLoading);

    useDocumentTitleEffect(
        (setDocumentTitle) => {
            if (setPageTitle && taskKey) {
                setDocumentTitle(`${CATEGORY_LABEL[category]} task ${taskKey}`);
            }
        },
        [taskKey, category]
    );

    const handleOnClose = () => {
        onClose();
        onDisclosureClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={handleOnClose}
            size="md"
            autoFocus={false}
        >
            <DrawerOverlay />
            <DrawerContent data-cy="drawer">
                <DrawerHeader
                    title={
                        task ? `${getTaskCategory(task)} on ${task.worker}` : ''
                    }
                    loading={taskLoading}
                    onClose={handleOnClose}
                />
                <DrawerBody
                    as={VStack}
                    alignItems="stretch"
                    spacing="8"
                    paddingX="5"
                    paddingY="8"
                >
                    {task && <ErrorAlert task={task} />}
                    <DrawerSection title="General">
                        <DrawerSectionEntry title="Status">
                            {taskLoading || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                <Status
                                    status={task.status}
                                    withIcon={false}
                                    variant="solid"
                                    size="sm"
                                />
                            )}
                        </DrawerSectionEntry>
                        <DrawerSectionKeyEntry
                            value={task?.key}
                            loading={taskLoading}
                        />
                        <DrawerSectionDateEntry
                            title="Created"
                            date={task?.creation_date}
                            loading={taskLoading}
                        />
                        <DrawerSectionEntry title="Duration">
                            {taskLoading || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                <Timing asset={task} />
                            )}
                        </DrawerSectionEntry>
                        <DrawerSectionEntry title="Owner">
                            {taskLoading || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                task.owner
                            )}
                        </DrawerSectionEntry>
                        <DrawerSectionEntry title="Compute plan">
                            {taskLoading || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                <Link
                                    color="teal.500"
                                    fontWeight="semibold"
                                    isExternal
                                    href={compilePath(
                                        PATHS.COMPUTE_PLAN_TASKS_ROOT,
                                        {
                                            key: task.compute_plan_key,
                                        }
                                    )}
                                >
                                    {task.compute_plan_key}
                                </Link>
                            )}
                        </DrawerSectionEntry>
                        <DrawerSectionEntry title="Rank">
                            {taskLoading || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                task.rank
                            )}
                        </DrawerSectionEntry>
                    </DrawerSection>

                    <DrawerSection title="Input">
                        <DrawerSectionEntry title="Algorithm">
                            {taskLoading || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                <Text
                                    isTruncated
                                    maxWidth={
                                        DRAWER_SECTION_ENTRY_LINK_MAX_WIDTH
                                    }
                                >
                                    <Link
                                        href={compilePath(PATHS.ALGO, {
                                            key: task.algo.key,
                                        })}
                                        color="teal.500"
                                        fontWeight="semibold"
                                        isExternal
                                    >
                                        {task.algo.name}
                                    </Link>
                                </Text>
                            )}
                        </DrawerSectionEntry>
                        {task && isTesttuple(task) && (
                            <>
                                <DrawerSectionTestedModel task={task} />
                                <DrawerSectionMetricsEntry task={task} />
                            </>
                        )}
                        {taskLoading || !task ? (
                            <Skeleton height="4" width="250px" />
                        ) : (
                            (isTesttuple(task) ||
                                isCompositeTraintuple(task) ||
                                isTraintuple(task)) && (
                                <DrawerSectionDatasetEntry
                                    dataset={getTaskDataset(task)}
                                    dataSampleKeys={getTaskDataSampleKeys(task)}
                                />
                            )
                        )}

                        {taskLoading || !task ? (
                            <Skeleton height="4" width="250px" />
                        ) : (
                            <DrawerSectionParentTasksEntry
                                parentTasks={task.parent_tasks}
                            />
                        )}
                    </DrawerSection>

                    {taskLoading || !task ? (
                        <Skeleton height="4" width="250px" />
                    ) : (
                        (isTraintuple(task) ||
                            isCompositeTraintuple(task) ||
                            isAggregatetuple(task)) && (
                            <DrawerSection title="Output">
                                <DrawerSectionOutModelEntry task={task} />
                            </DrawerSection>
                        )
                    )}

                    {taskLoading || !task ? (
                        <Skeleton height="4" width="250px" />
                    ) : (
                        isTesttuple(task) && (
                            <DrawerSection title="Performances">
                                {task.test.metrics.map((metric) => {
                                    const perf = getPerf(task, metric.key);
                                    return (
                                        <DrawerSectionEntryWrapper
                                            key={metric.key}
                                        >
                                            <Text
                                                whiteSpace="nowrap"
                                                width="410px"
                                                isTruncated
                                                flexShrink="0"
                                            >
                                                {metric.name}
                                            </Text>
                                            <Box flexGrow="1" textAlign="right">
                                                {perf === null
                                                    ? 'N/A'
                                                    : perf.toFixed(3)}
                                            </Box>
                                        </DrawerSectionEntryWrapper>
                                    );
                                })}
                            </DrawerSection>
                        )
                    )}
                    <MetadataDrawerSection
                        metadata={task?.metadata}
                        loading={taskLoading}
                    />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default TaskDrawer;
