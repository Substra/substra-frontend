import { Fragment } from 'react';

import AlgoSiderSection from './AlgoSiderSection';
import DatasetSiderSection from './DatasetSiderSection';
import InModelsSiderSection from './InModelsSiderSection';
import TimelineSiderSection from './TimelineSiderSection';

import { TrainTaskT } from '@/modules/tasks/TasksTypes';

import PermissionSiderSection from '@/components/PermissionSiderSection';

interface TrainTaskSiderContentProps {
    task: TrainTaskT;
}

const TrainTaskSiderContent = ({
    task,
}: TrainTaskSiderContentProps): JSX.Element => {
    return (
        <Fragment>
            <AlgoSiderSection task={task} />
            <DatasetSiderSection task={task} />
            <InModelsSiderSection task={task} />
            <PermissionSiderSection permission={task.permissions.process} />
            <TimelineSiderSection />
        </Fragment>
    );
};

export default TrainTaskSiderContent;
