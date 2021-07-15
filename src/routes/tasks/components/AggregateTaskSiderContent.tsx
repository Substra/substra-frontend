import { Fragment } from 'react';
import { AggregateTaskT } from '@/modules/tasks/TasksTypes';
import AlgoSiderSection from './AlgoSiderSection';
import TimelineSiderSection from './TimelineSiderSection';
import PermissionSiderSection from '@/components/PermissionSiderSection';
import InModelsSiderSection from './InModelsSiderSection';

interface AggregateTaskSiderContentProps {
    task: AggregateTaskT;
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
