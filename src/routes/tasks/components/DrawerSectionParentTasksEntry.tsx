import { useRoute } from 'wouter';

import { List, ListItem, Link, HStack, Text } from '@chakra-ui/react';
import { RiGitCommitLine } from 'react-icons/ri';

import AngleIcon from '@/assets/svg/angle-icon.svg';
import { getTaskCategory } from '@/modules/tasks/TasksUtils';
import {
    CompositeTraintupleStubT,
    TraintupleStubT,
    AggregatetupleStubT,
    TASK_CATEGORY_SLUGS,
} from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';

import { DrawerSectionCollapsibleEntry } from '@/components/DrawerSection';
import IconTag from '@/components/IconTag';
import Status from '@/components/Status';

const DrawerSectionParentTasksEntry = ({
    parentTasks,
}: {
    parentTasks: (
        | TraintupleStubT
        | AggregatetupleStubT
        | CompositeTraintupleStubT
    )[];
}): JSX.Element | null => {
    const [isTaskPath] = useRoute(PATHS.TASK);

    const getTaskHref = (
        task: TraintupleStubT | AggregatetupleStubT | CompositeTraintupleStubT
    ): string => {
        if (isTaskPath) {
            return compilePath(PATHS.TASK, {
                key: task.key,
                category: TASK_CATEGORY_SLUGS[task.category],
            });
        }
        return compilePath(PATHS.COMPUTE_PLAN_TASK, {
            key: task.compute_plan_key,
            category: TASK_CATEGORY_SLUGS[task.category],
            taskKey: task.key,
        });
    };

    if (parentTasks.length === 0) {
        return null;
    }

    return (
        <DrawerSectionCollapsibleEntry
            title="Parent tasks"
            aboveFold={
                parentTasks.length === 1
                    ? '1 parent task'
                    : `${parentTasks.length} parent tasks`
            }
        >
            <List width="100%" spacing="1.5">
                {parentTasks.map((parentTask) => (
                    <ListItem
                        key={parentTask.key}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <HStack spacing="2.5">
                            <AngleIcon />
                            <IconTag
                                icon={RiGitCommitLine}
                                backgroundColor="gray.100"
                                fill="gray.500"
                            />
                            <Text noOfLines={1} maxWidth="300px">
                                <Link
                                    color="teal.500"
                                    fontWeight="semibold"
                                    href={getTaskHref(parentTask)}
                                    isExternal
                                >
                                    {`${getTaskCategory(parentTask)} on ${
                                        parentTask.worker
                                    }`}
                                </Link>
                            </Text>
                        </HStack>
                        <Status
                            withIcon={false}
                            status={parentTask.status}
                            size="sm"
                        />
                    </ListItem>
                ))}
            </List>
        </DrawerSectionCollapsibleEntry>
    );
};
export default DrawerSectionParentTasksEntry;
