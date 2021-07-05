import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'wouter';

import {
    CompositeTrainTaskT,
    TestTaskT,
    TrainTaskT,
} from '@/modules/tasks/TasksTypes';
import { compilePath, PATHS } from '@/routes';
import { Spaces } from '@/assets/theme';
import ExpandableSiderSection from '@/components/ExpandableSiderSection';

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
    task: TrainTaskT | TestTaskT | CompositeTrainTaskT;
}

const DatasetSiderSection = ({
    task,
}: DatasetSiderSectionProps): JSX.Element => {
    return (
        <ExpandableSiderSection title="Dataset">
            <Link
                href={compilePath(PATHS.DATASET, { key: task.dataset.key })}
            >{`Dataset ${task.dataset.key}`}</Link>
            <UlTitle>Data sample keys:</UlTitle>
            <Ul>
                {task.dataset.data_sample_keys.map((data_sample_key) => (
                    <li key={data_sample_key}>{data_sample_key}</li>
                ))}
            </Ul>
        </ExpandableSiderSection>
    );
};

export default DatasetSiderSection;
