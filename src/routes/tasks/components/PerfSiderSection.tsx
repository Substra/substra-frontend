import { TesttupleT } from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import StyledLink from '@/components/StyledLink';

interface TrainTaskSiderContentProps {
    task: TesttupleT;
}

const PerfSiderSection = ({
    task,
}: TrainTaskSiderContentProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>Performance</SiderSectionTitle>
            <ul>
                {Object.entries(task.test.perfs).map(([metricKey, perf]) => (
                    <li>
                        <StyledLink
                            href={compilePath(PATHS.METRIC, {
                                key: metricKey,
                            })}
                        >
                            {metricKey}
                        </StyledLink>
                        {`: ${perf}`}
                    </li>
                ))}
            </ul>
        </SiderSection>
    );
};

export default PerfSiderSection;
