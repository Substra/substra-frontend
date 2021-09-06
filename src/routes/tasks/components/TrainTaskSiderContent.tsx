import { Fragment } from 'react';

import AlgoSiderSection from './AlgoSiderSection';
import DatasetSiderSection from './DatasetSiderSection';
import InModelsSiderSection from './InModelsSiderSection';
import ModelSiderSection from './ModelSiderSection';

import { getSimpleModel } from '@/modules/tasks/ModelsUtils';
import { TraintupleT } from '@/modules/tasks/TuplesTypes';

import PermissionSiderSection from '@/components/PermissionSiderSection';

interface TrainTaskSiderContentProps {
    task: TraintupleT;
}

const TrainTaskSiderContent = ({
    task,
}: TrainTaskSiderContentProps): JSX.Element => {
    return (
        <Fragment>
            <AlgoSiderSection task={task} />
            <DatasetSiderSection task={task} />
            <InModelsSiderSection task={task} />
            <ModelSiderSection
                title="Out model key"
                model={getSimpleModel(task)}
            />
            <PermissionSiderSection
                title="Out model permissions"
                permission={task.train.model_permissions.process}
            />
        </Fragment>
    );
};

export default TrainTaskSiderContent;
