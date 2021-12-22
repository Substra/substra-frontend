import {
    List,
    ListItem,
    Link as ChakraLink,
    HStack,
    Text,
} from '@chakra-ui/react';
import { RiGitCommitLine } from 'react-icons/ri';
import { Link, useRoute } from 'wouter';

import { getTaskCategory } from '@/modules/tasks/TasksUtils';
import {
    CompositeTraintupleStub,
    TraintupleStub,
    AggregatetupleStub,
} from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';

import DrawerSectionContainer from '@/components/DrawerSectionContainer';
import IconTag from '@/components/IconTag';
import Status from '@/components/Status';

const ParentTasksDrawerSection = ({
    parentTasks,
}: {
    parentTasks: (
        | TraintupleStub
        | AggregatetupleStub
        | CompositeTraintupleStub
    )[];
}): JSX.Element | null => {
    const [isTaskPath] = useRoute(PATHS.TASK);

    const getTaskHref = (
        task: TraintupleStub | AggregatetupleStub | CompositeTraintupleStub
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
        <DrawerSectionContainer title="Parent tasks">
            <List width="100%" spacing="1.5">
                {parentTasks.map((parentTask) => (
                    <ListItem
                        key={parentTask.key}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Link href={getTaskHref(parentTask)}>
                            <ChakraLink color="teal.500">
                                <HStack spacing="2.5">
                                    <IconTag
                                        icon={RiGitCommitLine}
                                        fill="teal.500"
                                        backgroundColor="teal.100"
                                    />
                                    <Text fontSize="xs">
                                        {`${getTaskCategory(parentTask)} on ${
                                            parentTask.worker
                                        }`}
                                    </Text>
                                </HStack>
                            </ChakraLink>
                        </Link>
                        <Status
                            withIcon={false}
                            status={parentTask.status}
                            size="sm"
                        />
                    </ListItem>
                ))}
            </List>
        </DrawerSectionContainer>
    );
};
export default ParentTasksDrawerSection;
