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
    Skeleton,
    HStack,
} from '@chakra-ui/react';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import { retrieveTask } from '@/modules/tasks/TasksSlice';
import { CATEGORY_LABEL, getTaskCategory } from '@/modules/tasks/TasksUtils';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';
import TaskOutputsDrawerSection from '@/routes/tasks/components/TaskOutputsDrawerSection';

import DownloadIconButton from '@/components/DownloadIconButton';
import DrawerHeader from '@/components/DrawerHeader';
import {
    DrawerSection,
    DrawerSectionEntry,
    DrawerSectionDateEntry,
    DrawerSectionKeyEntry,
    OrganizationDrawerSectionEntry,
} from '@/components/DrawerSection';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';
import Status from '@/components/Status';
import Timing from '@/components/Timing';

import ErrorAlert from './ErrorAlert';
import TaskInputsDrawerSection from './TaskInputsDrawerSection';

type TaskDrawerProps = {
    category: TaskCategory;
    onClose: () => void;
    taskKey: string | undefined | null;
    setPageTitle: boolean;
};

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
                        <OrganizationDrawerSectionEntry
                            title="Owner"
                            loading={taskLoading}
                            organization={task?.owner}
                        />
                        <DrawerSectionEntry title="Compute plan">
                            {taskLoading || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                <Link
                                    color="primary.500"
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
                        <DrawerSectionEntry title="Algorithm">
                            {taskLoading || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                <HStack spacing="2.5">
                                    <Text noOfLines={1}>
                                        <Link
                                            href={compilePath(PATHS.ALGO, {
                                                key: task.algo.key,
                                            })}
                                            color="primary.500"
                                            fontWeight="semibold"
                                            isExternal
                                        >
                                            {task.algo.name}
                                        </Link>
                                    </Text>
                                    <DownloadIconButton
                                        storageAddress={
                                            task.algo.algorithm.storage_address
                                        }
                                        filename={`algo-${task.algo.key}.zip`}
                                        aria-label="Download algo"
                                        size="xs"
                                        placement="top"
                                    />
                                </HStack>
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
                    <TaskInputsDrawerSection
                        loading={taskLoading}
                        task={task || null}
                    />
                    <TaskOutputsDrawerSection
                        loading={taskLoading}
                        task={task || null}
                    />
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
