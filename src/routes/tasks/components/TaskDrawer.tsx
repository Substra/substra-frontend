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

import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useHasPermission from '@/hooks/useHasPermission';
import { compilePath, PATHS } from '@/paths';
import FunctionDurationBar from '@/routes/functions/components/FunctionDurationBar';
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
import Duration from '@/components/Duration';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';
import Status from '@/components/Status';
import Timing from '@/components/Timing';

import useTaskStore from '../useTaskStore';
import ErrorAlert from './ErrorAlert';
import TaskDurationBar from './TaskDurationBar';
import TaskInputsDrawerSection from './TaskInputsDrawerSection';

type TaskDrawerProps = {
    onClose: () => void;
    taskKey: string | undefined | null;
    setPageTitle: boolean;
};

const TaskDrawer = ({
    onClose,
    taskKey,
    setPageTitle,
}: TaskDrawerProps): JSX.Element => {
    const { isOpen, onOpen, onClose: onDisclosureClose } = useDisclosure();

    const { task, fetchingTask, fetchTask } = useTaskStore();

    const hasFunctionDownloadPermission = useHasPermission();

    useEffect(() => {
        if (taskKey) {
            if (!isOpen) {
                onOpen();
                fetchTask(taskKey);
            }
        }
    }, [fetchTask, isOpen, onOpen, taskKey]);

    useDocumentTitleEffect(
        (setDocumentTitle) => {
            if (setPageTitle && taskKey) {
                setDocumentTitle(`Task ${taskKey}`);
            }
        },
        [taskKey]
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
                    title={task ? `Task on ${task.worker}` : ''}
                    loading={fetchingTask}
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
                    <FunctionDurationBar functionKey={task?.function.key} />
                    <TaskDurationBar taskKey={taskKey} />
                    <DrawerSection title="General">
                        <DrawerSectionEntry title="Status">
                            {fetchingTask || !task ? (
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
                            loading={fetchingTask}
                        />
                        <DrawerSectionDateEntry
                            title="Created"
                            date={task?.creation_date}
                            loading={fetchingTask}
                        />
                        <DrawerSectionEntry title="Duration">
                            {fetchingTask || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                <>
                                    <Timing asset={task} />
                                    <Duration asset={task} />
                                </>
                            )}
                        </DrawerSectionEntry>
                        <OrganizationDrawerSectionEntry
                            title="Owner"
                            loading={fetchingTask}
                            organization={task?.owner}
                        />
                        <DrawerSectionEntry title="Compute plan">
                            {fetchingTask || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                <Link
                                    color="primary.500"
                                    fontWeight="semibold"
                                    isExternal
                                    href={compilePath(
                                        PATHS.COMPUTE_PLAN_TASKS,
                                        {
                                            key: task.compute_plan_key,
                                        }
                                    )}
                                >
                                    {task.compute_plan_key}
                                </Link>
                            )}
                        </DrawerSectionEntry>
                        <DrawerSectionEntry title="Function">
                            {fetchingTask || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                <HStack spacing="2.5">
                                    <Text noOfLines={1} flexGrow="1">
                                        <Link
                                            href={compilePath(PATHS.FUNCTION, {
                                                key: task.function.key,
                                            })}
                                            color="primary.500"
                                            fontWeight="semibold"
                                            isExternal
                                        >
                                            {task.function.name}
                                        </Link>
                                    </Text>
                                    <DownloadIconButton
                                        storageAddress={
                                            task.function.archive
                                                .storage_address
                                        }
                                        filename={`function-${task.function.key}.zip`}
                                        aria-label={
                                            hasFunctionDownloadPermission(
                                                task.function.permissions
                                                    .download
                                            )
                                                ? 'Download function'
                                                : "You don't have the download permission for this function"
                                        }
                                        size="xs"
                                        placement="top"
                                        isDisabled={
                                            !hasFunctionDownloadPermission(
                                                task.function.permissions
                                                    .download
                                            )
                                        }
                                    />
                                </HStack>
                            )}
                        </DrawerSectionEntry>
                        <DrawerSectionEntry title="Rank">
                            {fetchingTask || !task ? (
                                <Skeleton height="4" width="250px" />
                            ) : (
                                task.rank
                            )}
                        </DrawerSectionEntry>
                    </DrawerSection>
                    <TaskInputsDrawerSection
                        taskLoading={fetchingTask}
                        task={task || null}
                    />
                    <TaskOutputsDrawerSection
                        taskLoading={fetchingTask}
                        task={task || null}
                    />
                    <MetadataDrawerSection
                        metadata={task?.metadata}
                        loading={fetchingTask}
                    />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default TaskDrawer;
