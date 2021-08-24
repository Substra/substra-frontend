import { Fragment } from 'react';

import AlgoSiderSection from './AlgoSiderSection';
import DatasetSiderSection from './DatasetSiderSection';
import ModelSiderSection from './ModelSiderSection';
import TimelineSiderSection from './TimelineSiderSection';

import { CompositeTraintupleT } from '@/modules/tasks/TuplesTypes';

import PermissionSiderSection from '@/components/PermissionSiderSection';

interface CompositeTrainTaskSiderContentProps {
    task: CompositeTraintupleT;
}

const CompositeTrainTaskSiderContent = ({
    task,
}: CompositeTrainTaskSiderContentProps): JSX.Element => {
    return (
        <Fragment>
            <AlgoSiderSection task={task} />
            <DatasetSiderSection task={task} />
            <ModelSiderSection
                title="In trunk model"
                model={task.in_trunk_model}
            />
            <ModelSiderSection
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
