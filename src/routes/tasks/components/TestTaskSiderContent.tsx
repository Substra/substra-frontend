import { Fragment } from 'react';

import DatasetSiderSection from './DatasetSiderSection';
import MetricSiderSection from './MetricSiderSection';
import TimelineSiderSection from './TimelineSiderSection';
import TraintupleSiderSection from './TraintupleSiderSection';

import { TestTaskT } from '@/modules/tasks/TasksTypes';

interface TrainTaskSiderContentProps {
    task: TestTaskT;
}

const TrainTaskSiderContent = ({
    task,
}: TrainTaskSiderContentProps): JSX.Element => {
    return (
        <Fragment>
            <TraintupleSiderSection task={task} />
            <MetricSiderSection task={task} />
            <DatasetSiderSection task={task} />
            <TimelineSiderSection />
        </Fragment>
    );
};

export default TrainTaskSiderContent;
