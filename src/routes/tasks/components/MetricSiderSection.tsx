import { Link } from 'wouter';

import { TesttupleT } from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';

interface TrainTaskSiderContentProps {
    task: TesttupleT;
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
