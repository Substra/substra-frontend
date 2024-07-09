import { useEffect, useState } from 'react';

import { TaskExecutionRundownT } from '@/types/ProfilingTypes';

import ProfilingDurationBar from '@/components/ProfilingDurationBar';

import { taskStepsInfo } from '../TasksUtils';
import useTaskStore from '../useTaskStore';

const PROFILING_BAR_TOOLTIP =
    "This is an experimental feature. The sum of task's steps durations might not be equal to the task duration.";

// Returns sum duration of all step currently done in seconds
// Returns null if no step is done
const getTaskDuration = (
    taskProfiling: TaskExecutionRundownT | null
): number | null => {
    if (!taskProfiling || taskProfiling.execution_rundown.length === 0) {
        return null;
    }

    return taskProfiling.execution_rundown.reduce(
        (taskDuration, step) => taskDuration + step.duration,
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

    useEffect(() => {
        if (taskKey) {
            fetchTaskProfiling(taskKey);
        }
    }, [fetchTaskProfiling, taskKey]);
    const [taskDuration, setTaskDuration] = useState<number | null>(null);

    useEffect(() => {
        setTaskDuration(getTaskDuration(taskProfiling));
    }, [taskProfiling]);

    return (
        <ProfilingDurationBar
            execution_rundown={taskProfiling?.execution_rundown || []}
            duration={taskDuration}
            loading={fetchingTaskProfiling}
            stepsInfo={taskStepsInfo}
            title="Execution duration"
            tooltipLabel={PROFILING_BAR_TOOLTIP}
        />
    );
};

export default TaskDurationBar;
