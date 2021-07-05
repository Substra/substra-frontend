import React, { Fragment } from 'react';
import { TrainTaskT } from '@/modules/tasks/TasksTypes';
import AlgoSiderSection from './AlgoSiderSection';
import TimelineSiderSection from './TimelineSiderSection';
import PermissionSiderSection from '@/components/PermissionSiderSection';
import InModelsSiderSection from './InModelsSiderSection';
import DatasetSiderSection from './DatasetSiderSection';

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
