import { Link } from 'wouter';

import {
    TesttupleT,
    TesttupleTraintupleType,
} from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';

interface TraintupleSiderSectionProps {
    task: TesttupleT;
}

const titles: { [key in TesttupleTraintupleType]: string } = {
    traintuple: 'Tested train task',
    composite_traintuple: 'Tested composite train task',
    aggregatetuple: 'Tested aggregate task',
};

const TraintupleSiderSection = ({
    task,
}: TraintupleSiderSectionProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>
                {titles[task.traintuple_type]}
            </SiderSectionTitle>
            <Link href={compilePath(PATHS.TASK, { key: task.traintuple_key })}>
                {task.traintuple_key}
            </Link>
        </SiderSection>
    );
};

export default TraintupleSiderSection;
