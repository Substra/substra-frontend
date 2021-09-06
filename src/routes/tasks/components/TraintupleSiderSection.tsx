import { TesttupleT } from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import StyledLink from '@/components/StyledLink';

interface TraintupleSiderSectionProps {
    task: TesttupleT;
}

const TraintupleSiderSection = ({
    task,
}: TraintupleSiderSectionProps): JSX.Element => {
    const testedTaskKey = task.parent_task_keys[0];

    return (
        <SiderSection>
            <SiderSectionTitle>Tested task</SiderSectionTitle>
            <StyledLink href={compilePath(PATHS.TASK, { key: testedTaskKey })}>
                {testedTaskKey}
            </StyledLink>
        </SiderSection>
    );
};

export default TraintupleSiderSection;
