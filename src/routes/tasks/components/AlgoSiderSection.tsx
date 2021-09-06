import {
    AggregatetupleT,
    CompositeTraintupleT,
    TraintupleT,
} from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import StyledLink from '@/components/StyledLink';

interface TrainTaskSiderContentProps {
    task: TraintupleT | CompositeTraintupleT | AggregatetupleT;
}

const AlgoSiderSection = ({
    task,
}: TrainTaskSiderContentProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>Algorithm</SiderSectionTitle>
            <StyledLink href={compilePath(PATHS.ALGO, { key: task.algo.key })}>
                {task.algo.name}
            </StyledLink>
        </SiderSection>
    );
};

export default AlgoSiderSection;
