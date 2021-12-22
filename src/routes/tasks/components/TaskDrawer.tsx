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
    Text,
} from '@chakra-ui/react';

import { retrieveTask } from '@/modules/tasks/TasksSlice';
import {
    CATEGORY_LABEL,
    getTaskCategory,
    getTaskDataSampleKeys,
    getTaskDataset,
} from '@/modules/tasks/TasksUtils';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';

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
    TableDrawerSectionDateEntry,
    TableDrawerSectionKeyEntry,
} from '@/components/TableDrawerSection';

interface TaskDrawerProps {
    category: TaskCategory;
    compileListPath: (category: TaskCategory) => string;
    taskKey: string | undefined;
}
const TaskDrawer = ({
    category,
    compileListPath,
    taskKey,
}: TaskDrawerProps): JSX.Element => {
    const { setLocationWithParams } = useLocationWithParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (taskKey) {
            if (!isOpen) {
                onOpen();
            }

            dispatch(retrieveTask({ category, key: taskKey }));
        }
    }, [taskKey]);

    const task = useAppSelector((state) => state.tasks.task);
    const taskLoading = useAppSelector((state) => state.tasks.taskLoading);

    useDocumentTitleEffect(
        (setDocumentTitle) => {
            setDocumentTitle(`${CATEGORY_LABEL[category]} task ${taskKey}`);
        },
        [taskKey, category]
    );

    const handleOnClose = () => {
        setLocationWithParams(compileListPath(category));
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
            <DrawerContent data-cy="drawer">
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
                        <TabPanel paddingX="5">
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
                                            maxWidth="300px"
                                        />
                                        <TableDrawerSectionDateEntry
                                            title="Created"
                                            date={task.creation_date}
                                        />
                                        {task.start_date && (
                                            <TableDrawerSectionDateEntry
                                                title="Started"
                                                date={task.start_date}
                                            />
                                        )}
                                        {task.end_date && (
                                            <TableDrawerSectionDateEntry
                                                title="Ended"
                                                date={task.end_date}
                                            />
                                        )}
                                        <TableDrawerSectionEntry title="Owner">
                                            {task.owner}
                                        </TableDrawerSectionEntry>
                                    </TableDrawerSection>
                                    <ParentTasksDrawerSection
                                        parentTasks={task.parent_tasks}
                                    />
                                    {isTesttuple(task) && (
                                        <TableDrawerSection title="Performances">
                                            {task.test.metrics.map((metric) => (
                                                <TableDrawerSectionEntry
                                                    title={metric.name}
                                                >
                                                    {task.test.perfs[
                                                        metric.key
                                                    ].toFixed(2)}
                                                </TableDrawerSectionEntry>
                                            ))}
                                        </TableDrawerSection>
                                    )}
                                </DrawerBody>
                            )}
                        </TabPanel>
                        <TabPanel paddingX="5">
                            {task && (
                                <DrawerBody
                                    as={VStack}
                                    alignItems="stretch"
                                    spacing="8"
                                >
                                    <TableDrawerSection title="Assets">
                                        <TableDrawerSectionEntry title="Algorithm">
                                            <Text
                                                isTruncated
                                                maxWidth="370px"
                                                textAlign="right"
                                                marginLeft="auto"
                                            >
                                                <Link
                                                    href={compilePath(
                                                        PATHS.ALGO,
                                                        {
                                                            key: task.algo.key,
                                                        }
                                                    )}
                                                    color="teal.500"
                                                    isExternal
                                                >
                                                    {task.algo.name}
                                                </Link>
                                            </Text>
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
