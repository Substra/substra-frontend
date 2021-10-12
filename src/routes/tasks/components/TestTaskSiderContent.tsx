import { Fragment } from 'react';

import DatasetSiderSection from './DatasetSiderSection';
import PerfSiderSection from './PerfSiderSection';
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
            <PerfSiderSection task={task} />
            <DatasetSiderSection task={task} />
        </Fragment>
    );
};

export default TestTaskSiderContent;
