import { Link } from 'wouter';

import {
    AggregatetupleT,
    CompositeTraintupleT,
    TraintupleT,
} from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';

interface TrainTaskSiderContentProps {
    task: TraintupleT | CompositeTraintupleT | AggregatetupleT;
}

const AlgoSiderSection = ({
    task,
}: TrainTaskSiderContentProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>Algorithm</SiderSectionTitle>
            <Link href={compilePath(PATHS.ALGO, { key: task.algo.key })}>
                {task.algo.name}
            </Link>
        </SiderSection>
    );
};

export default AlgoSiderSection;
