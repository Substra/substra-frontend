import { Fragment } from 'react';

import AlgoSiderSection from './AlgoSiderSection';
import DatasetSiderSection from './DatasetSiderSection';
import InModelsSiderSection from './InModelsSiderSection';
import ModelSiderSection from './ModelSiderSection';
import TimelineSiderSection from './TimelineSiderSection';

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
            <ModelSiderSection title="Out model key" model={task.out_model} />
            <PermissionSiderSection
                title="Out model permissions"
                permission={task.permissions.process}
            />
            <PermissionSiderSection permission={task.permissions.process} />
            <TimelineSiderSection />
        </Fragment>
    );
};

export default TrainTaskSiderContent;
