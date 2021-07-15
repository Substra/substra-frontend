import {
    AggregateTaskT,
    CompositeTrainTaskT,
    TrainTaskT,
} from '@/modules/tasks/TasksTypes';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import { Link } from 'wouter';
import { compilePath, PATHS } from '@/routes';

interface TrainTaskSiderContentProps {
    task: TrainTaskT | CompositeTrainTaskT | AggregateTaskT;
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
