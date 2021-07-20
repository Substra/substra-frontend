import { Link } from 'wouter';

import { TestTaskT } from '@/modules/tasks/TasksTypes';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';

interface TrainTaskSiderContentProps {
    task: TestTaskT;
}

const MetricSiderSection = ({
    task,
}: TrainTaskSiderContentProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>Metric</SiderSectionTitle>
            <Link href={compilePath(PATHS.METRIC, { key: task.objective.key })}>
                {task.objective.key}
            </Link>
        </SiderSection>
    );
};

export default MetricSiderSection;
