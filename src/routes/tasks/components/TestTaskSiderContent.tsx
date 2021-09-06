import { Fragment } from 'react';

import DatasetSiderSection from './DatasetSiderSection';
import MetricSiderSection from './MetricSiderSection';
import TraintupleSiderSection from './TraintupleSiderSection';

import { TesttupleT } from '@/modules/tasks/TuplesTypes';

interface TrainTaskSiderContentProps {
    task: TesttupleT;
}

const TestTaskSiderContent = ({
    task,
}: TrainTaskSiderContentProps): JSX.Element => {
    return (
        <Fragment>
            <TraintupleSiderSection task={task} />
            <MetricSiderSection task={task} />
            <DatasetSiderSection task={task} />
        </Fragment>
    );
};

export default TestTaskSiderContent;
