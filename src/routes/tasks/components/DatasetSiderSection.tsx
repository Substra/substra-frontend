import styled from '@emotion/styled';

import {
    CompositeTraintupleT,
    TesttupleT,
    TraintupleT,
} from '@/modules/tasks/TuplesTypes';

import { isTesttupleT, isTraintupleT } from '@/libs/tuples';

import { compilePath, PATHS } from '@/routes';

import ExpandableSiderSection from '@/components/ExpandableSiderSection';
import StyledLink from '@/components/StyledLink';

import { Spaces } from '@/assets/theme';

const Ul = styled.ul`
    list-style-type: initial;
    list-style-position: outside;
    margin-top: ${Spaces.small};
    margin-left: ${Spaces.medium};
`;

const UlTitle = styled.div`
    margin-top: ${Spaces.medium};
`;

interface DatasetSiderSectionProps {
    task: TraintupleT | TesttupleT | CompositeTraintupleT;
}

const DatasetSiderSection = ({
    task,
}: DatasetSiderSectionProps): JSX.Element => {
    let dataset_key: string;
    let data_sample_keys: string[] = [];
    if (isTraintupleT(task)) {
        dataset_key = task.train.data_manager_key;
        data_sample_keys = task.train.data_sample_keys;
    } else if (isTesttupleT(task)) {
        dataset_key = task.test.data_manager_key;
        data_sample_keys = task.test.data_sample_keys;
    } else {
        dataset_key = task.composite.data_manager_key;
        data_sample_keys = task.composite.data_sample_keys;
    }

    return (
        <ExpandableSiderSection title="Dataset">
            <StyledLink href={compilePath(PATHS.DATASET, { key: dataset_key })}>
                {`Dataset ${dataset_key}`}
            </StyledLink>
            <UlTitle>Data sample keys:</UlTitle>
            <Ul>
                {data_sample_keys.map((data_sample_key) => (
                    <li key={data_sample_key}>{data_sample_key}</li>
                ))}
            </Ul>
        </ExpandableSiderSection>
    );
};

export default DatasetSiderSection;
