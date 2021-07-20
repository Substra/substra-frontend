import { Fragment } from 'react';

import AlgoSiderSection from './AlgoSiderSection';
import DatasetSiderSection from './DatasetSiderSection';
import InModelSiderSection from './InModelSiderSection';
import TimelineSiderSection from './TimelineSiderSection';

import { CompositeTrainTaskT } from '@/modules/tasks/TasksTypes';

import PermissionSiderSection from '@/components/PermissionSiderSection';

interface CompositeTrainTaskSiderContentProps {
    task: CompositeTrainTaskT;
}

const CompositeTrainTaskSiderContent = ({
    task,
}: CompositeTrainTaskSiderContentProps): JSX.Element => {
    return (
        <Fragment>
            <AlgoSiderSection task={task} />
            <DatasetSiderSection task={task} />
            <InModelSiderSection
                title="In trunk model"
                model={task.in_trunk_model}
            />
            <InModelSiderSection
                title="In head model"
                model={task.in_head_model}
            />
            <PermissionSiderSection
                title="Out trunk model permissions"
                permission={task.out_trunk_model.permissions.process}
            />
            <PermissionSiderSection
                title="Out head model permissions"
                permission={task.out_head_model.permissions.process}
            />
            <TimelineSiderSection />
        </Fragment>
    );
};

export default CompositeTrainTaskSiderContent;
