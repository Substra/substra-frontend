import { useEffect, useState } from 'react';

import { ExecutionRundownT, StepT } from '@/types/ProfilingTypes';

import ProfilingDurationBar from '@/components/ProfilingDurationBar';

import { taskOrder } from '../TasksUtils';
import useTaskStore from '../useTaskStore';

// Returns sum duration of all step currently done in seconds
// Returns null if no step is done
const getTaskDuration = (
    taskProfiling: ExecutionRundownT | null
): number | null => {
    if (!taskProfiling || taskProfiling.execution_rundown.length === 0) {
        return null;
    }

    return taskProfiling.execution_rundown.reduce(
        (taskDuration, step) => taskDuration + step.duration / 1000000,
        0
    );
};

const TaskDurationBar = ({
    taskKey,
}: {
    taskKey: string | null | undefined;
}): JSX.Element => {
    const { taskProfiling, fetchingTaskProfiling, fetchTaskProfiling } =
        useTaskStore();

    const taskDuration = getTaskDuration(taskProfiling);

    useEffect(() => {
        if (taskKey) {
            fetchTaskProfiling(taskKey);
        }
    }, [fetchTaskProfiling, taskKey]);

    const [sortedExecutionRundown, setSortedExecutionRundown] = useState<
        StepT[]
    >([]);

    useEffect(() => {
        if (taskProfiling?.execution_rundown) {
            setSortedExecutionRundown(
                taskProfiling.execution_rundown.sort(
                    (a, b) =>
                        // In case the step is not ordered, a will be before b
                        (taskOrder.get(a.step) ?? 4) -
                        (taskOrder.get(b.step) ?? 5)
                )
            );
        }
    }, [taskProfiling?.execution_rundown]);

    return (
        <ProfilingDurationBar
            execution_rundown={sortedExecutionRundown}
            duration={taskDuration}
            loading={fetchingTaskProfiling}
        />
    );
};

export default TaskDurationBar;
