import { TesttupleT } from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import StyledLink from '@/components/StyledLink';

interface TrainTaskSiderContentProps {
    task: TesttupleT;
}

const MetricSiderSection = ({
    task,
}: TrainTaskSiderContentProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>Metric</SiderSectionTitle>
            <StyledLink
                href={compilePath(PATHS.METRIC, {
                    key: task.test.objective_key,
                })}
            >
                {task.test.objective_key}
            </StyledLink>
        </SiderSection>
    );
};

export default MetricSiderSection;
