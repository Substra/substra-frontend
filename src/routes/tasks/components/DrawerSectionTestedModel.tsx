import { useState } from 'react';

import DrawerSectionOutModelEntryContent from './DrawerSectionOutModelEntryContent';
import { Skeleton } from '@chakra-ui/react';

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

import useEffectWithAbortController from '@/hooks/useEffectWithAbortController';

import { DrawerSectionEntry } from '@/components/DrawerSection';

const DrawerSectionTestedModel = ({
    task,
}: {
    task: Testtuple;
}): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);
    const [parentTask, setParentTask] = useState<
        Traintuple | CompositeTraintuple | Aggregatetuple
    >();

    const parentTaskStub = task.parent_tasks[0];

    useEffectWithAbortController(
        (abortController) => {
            const retrieveParentTask = async () => {
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

            retrieveParentTask();
        },
        [parentTaskStub.key]
    );

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
