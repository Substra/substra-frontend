import { useEffect } from 'react';

import DataSampleDrawerSection from './DataSampleDrawerSection';
import ParentTasksDrawerSection from './ParentTasksDrawerSection';
import TableDrawerSectionMetricsEntry from './TableDrawerSectionMetricsEntry';
import TableDrawerSectionOutModelEntry from './TableDrawerSectionOutModelEntry';
import {
    Drawer,
    DrawerContent,
    DrawerOverlay,
    useDisclosure,
    DrawerBody,
    VStack,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Link,
} from '@chakra-ui/react';
import { useRoute } from 'wouter';

import { retrieveTask } from '@/modules/tasks/TasksSlice';
import {
    getTaskCategory,
    getTaskDataSampleKeys,
    getTaskDataset,
} from '@/modules/tasks/TasksUtils';

import {
    isAggregatetuple,
    isCompositeTraintuple,
    isTesttuple,
    isTraintuple,
} from '@/libs/tuples';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import DrawerHeader from '@/components/DrawerHeader';
import Status from '@/components/Status';
import {
    TableDrawerSection,
    TableDrawerSectionEntry,
    TableDrawerSectionCreatedEntry,
    TableDrawerSectionKeyEntry,
} from '@/components/TableDrawerSection';

const TaskDrawer = (): JSX.Element => {
    const { setLocationWithParams } = useLocationWithParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isTaskPath, taskParams] = useRoute(PATHS.TASK);
    const [isComputePlanTask, computePlanTaskParams] = useRoute(
        PATHS.COMPUTE_PLAN_TASK
    );
    let key: string | undefined;
    if (isTaskPath) {
        key = taskParams?.key;
    } else if (isComputePlanTask) {
        key = computePlanTaskParams?.taskKey;
    }
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            if (!isOpen) {
                onOpen();
            }

            dispatch(retrieveTask(key));
        }
    }, [key]);

    const task = useAppSelector((state) => state.tasks.task);
    const taskLoading = useAppSelector((state) => state.tasks.taskLoading);

    useDocumentTitleEffect(
        (setDocumentTitle) => {
            if (key) {
                setDocumentTitle(`${key} (task)`);
            }
        },
        [key]
    );

    const handleOnClose = () => {
        if (isTaskPath) {
            setLocationWithParams(PATHS.TASKS);
        } else if (isComputePlanTask && computePlanTaskParams) {
            setLocationWithParams(
                compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                    key: computePlanTaskParams.key,
                })
            );
        }
        onClose();
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
            <DrawerContent>
                <DrawerHeader
                    title={
                        task ? `${getTaskCategory(task)} on ${task.worker}` : ''
                    }
                    loading={taskLoading}
                    onClose={handleOnClose}
                />
                <Tabs size="sm" colorScheme="teal">
                    <TabList paddingLeft="5" paddingRight="5">
                        <Tab paddingLeft="0" paddingRight="0">
                            Details
                        </Tab>
                        <Tab paddingLeft="0" paddingRight="0" marginLeft="2.5">
                            Assets
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {task && (
                                <DrawerBody
                                    as={VStack}
                                    alignItems="stretch"
                                    spacing="8"
                                >
                                    <TableDrawerSection title="General">
                                        <TableDrawerSectionEntry title="Category">
                                            {getTaskCategory(task)}
                                        </TableDrawerSectionEntry>
                                        <TableDrawerSectionEntry title="Status">
                                            <Status
                                                status={task.status}
                                                withIcon={false}
                                                variant="solid"
                                                size="sm"
                                            />
                                        </TableDrawerSectionEntry>
                                        <TableDrawerSectionKeyEntry
                                            value={task.key}
                                        />
                                        <TableDrawerSectionCreatedEntry
                                            date={task.creation_date}
                                        />
                                        <TableDrawerSectionEntry title="Owner">
                                            {task.owner}
                                        </TableDrawerSectionEntry>
                                    </TableDrawerSection>
                                    <ParentTasksDrawerSection
                                        parentTasks={task.parent_tasks}
                                    />
                                </DrawerBody>
                            )}
                        </TabPanel>
                        <TabPanel>
                            {task && (
                                <DrawerBody
                                    as={VStack}
                                    alignItems="stretch"
                                    spacing="8"
                                >
                                    <TableDrawerSection title="Assets">
                                        <TableDrawerSectionEntry title="Algorithm">
                                            <Link
                                                href={compilePath(PATHS.ALGO, {
                                                    key: task.algo.key,
                                                })}
                                                color="teal.500"
                                                isExternal
                                            >
                                                {task.algo.name}
                                            </Link>
                                        </TableDrawerSectionEntry>
                                        {(isTraintuple(task) ||
                                            isAggregatetuple(task) ||
                                            isCompositeTraintuple(task)) && (
                                            <TableDrawerSectionOutModelEntry
                                                task={task}
                                            />
                                        )}
                                        {isTesttuple(task) && (
                                            <TableDrawerSectionMetricsEntry
                                                task={task}
                                            />
                                        )}
                                    </TableDrawerSection>

                                    {(isTesttuple(task) ||
                                        isCompositeTraintuple(task) ||
                                        isTraintuple(task)) && (
                                        <DataSampleDrawerSection
                                            dataset={getTaskDataset(task)}
                                            dataSampleKeys={getTaskDataSampleKeys(
                                                task
                                            )}
                                        />
                                    )}
                                </DrawerBody>
                            )}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </DrawerContent>
        </Drawer>
    );
};

export default TaskDrawer;
