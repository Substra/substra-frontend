import { Fragment } from 'react';

import AlgoSiderSection from './AlgoSiderSection';
import InModelsSiderSection from './InModelsSiderSection';
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
            <PermissionSiderSection permission={task.permissions.process} />
            <TimelineSiderSection />
        </Fragment>
    );
};

export default AggregateTaskSiderContent;
