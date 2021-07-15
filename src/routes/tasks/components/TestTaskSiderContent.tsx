import { Fragment } from 'react';
import { TestTaskT } from '@/modules/tasks/TasksTypes';
import TimelineSiderSection from './TimelineSiderSection';
import DatasetSiderSection from './DatasetSiderSection';
import MetricSiderSection from './MetricSiderSection';
import TraintupleSiderSection from './TraintupleSiderSection';

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
