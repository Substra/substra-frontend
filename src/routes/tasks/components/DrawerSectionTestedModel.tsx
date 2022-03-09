import { useEffect, useState } from 'react';

import { Skeleton } from '@chakra-ui/react';

import useWithAbortController from '@/hooks/useWithAbortController';
import {
    retrieveAggregateTuple,
    retrieveCompositeTraintuple,
    retrieveTraintuple,
} from '@/modules/tasks/TasksApi';
import {
    Aggregatetuple,
    CompositeTraintuple,
    TaskCategory,
    Testtuple,
    Traintuple,
} from '@/modules/tasks/TuplesTypes';

import { DrawerSectionEntry } from '@/components/DrawerSection';

import DrawerSectionOutModelEntryContent from './DrawerSectionOutModelEntryContent';

const DrawerSectionTestedModel = ({
    task,
}: {
    task: Testtuple;
}): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);
    const [parentTask, setParentTask] = useState<
        Traintuple | CompositeTraintuple | Aggregatetuple
    >();
    const withAbortController = useWithAbortController();

    const parentTaskStub = task.parent_tasks[0];
    useEffect(() => {
        const retrieveParentTask = async (abortController: AbortController) => {
            setLoading(true);

            let method;
            if (parentTaskStub.category === TaskCategory.train) {
                method = retrieveTraintuple;
            } else if (parentTaskStub.category === TaskCategory.composite) {
                method = retrieveCompositeTraintuple;
            } else {
                method = retrieveAggregateTuple;
            }

            try {
                const response = await method(parentTaskStub.key, {
                    signal: abortController.signal,
                });
                setParentTask(response.data);
            } catch (error) {
                console.error(error);
            }

            setLoading(false);
        };

        return withAbortController(retrieveParentTask);
    }, [parentTaskStub.key]);

    return (
        <DrawerSectionEntry
            title={
                parentTaskStub.category === TaskCategory.composite
                    ? 'Tested models'
                    : 'Tested model'
            }
            alignItems="center"
        >
            {loading && <Skeleton height="24px" width="200px" />}
            {!loading && parentTask && (
                <DrawerSectionOutModelEntryContent task={parentTask} />
            )}
        </DrawerSectionEntry>
    );
};
export default DrawerSectionTestedModel;
