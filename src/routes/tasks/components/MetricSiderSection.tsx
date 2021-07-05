import React from 'react';
import { TestTaskT } from '@/modules/tasks/TasksTypes';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import { Link } from 'wouter';
import { compilePath, PATHS } from '@/routes';

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
