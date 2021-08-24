import { Fragment } from 'react';

import AlgoSiderSection from './AlgoSiderSection';
import InModelsSiderSection from './InModelsSiderSection';
import ModelSiderSection from './ModelSiderSection';
import TimelineSiderSection from './TimelineSiderSection';

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

export default AggregateTaskSiderContent;
