import { Fragment } from 'react';

import AlgoSiderSection from './AlgoSiderSection';
import InModelsSiderSection from './InModelsSiderSection';
import ModelSiderSection from './ModelSiderSection';

import { getSimpleModel } from '@/modules/tasks/ModelsUtils';
import { AggregatetupleT } from '@/modules/tasks/TuplesTypes';

import PermissionSiderSection from '@/components/PermissionSiderSection';

interface AggregateTaskSiderContentProps {
    task: AggregatetupleT;
}

const AggregateTaskSiderContent = ({
    task,
}: AggregateTaskSiderContentProps): JSX.Element => {
    return (
        <Fragment>
            <AlgoSiderSection task={task} />
            <InModelsSiderSection task={task} />
            <ModelSiderSection
                title="Out model key"
                model={getSimpleModel(task)}
            />
            <PermissionSiderSection
                title="Out model permissions"
                permissions={task.aggregate.model_permissions}
                modelUrl={getSimpleModel(task)?.address.storage_address}
                modelButtonTitle="Download out model"
            />
        </Fragment>
    );
};

export default AggregateTaskSiderContent;
