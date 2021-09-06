import { Fragment } from 'react';

import styled from '@emotion/styled';

import { AggregatetupleT, TraintupleT } from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import StyledLink from '@/components/StyledLink';

import { Spaces } from '@/assets/theme';

const Ul = styled.ul`
    list-style-type: initial;
    list-style-position: outside;
    margin-top: ${Spaces.small};
    margin-left: ${Spaces.medium};
`;

interface InModelsSiderSectionProps {
    task: TraintupleT | AggregatetupleT;
}

const InModelsSiderSection = ({
    task,
}: InModelsSiderSectionProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>In models</SiderSectionTitle>
            {task.parent_task_keys.length === 0 && 'No in models.'}
            {task.parent_task_keys.length > 0 && (
                <Fragment>
                    <p>Models from tasks:</p>
                    <Ul>
                        {task.parent_task_keys.map((task_key) => (
                            <li key={task_key}>
                                <StyledLink
                                    href={compilePath(PATHS.TASK, {
                                        key: task_key,
                                    })}
                                >
                                    {task_key}
                                </StyledLink>
                            </li>
                        ))}
                    </Ul>
                </Fragment>
            )}
        </SiderSection>
    );
};

export default InModelsSiderSection;
