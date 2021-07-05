import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { Link } from 'wouter';

import { AggregateTaskT, TrainTaskT } from '@/modules/tasks/TasksTypes';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import { compilePath, PATHS } from '@/routes';
import { Spaces } from '@/assets/theme';

const Ul = styled.ul`
    list-style-type: initial;
    list-style-position: outside;
    margin-top: ${Spaces.small};
    margin-left: ${Spaces.medium};
`;

interface InModelsSiderSectionProps {
    task: TrainTaskT | AggregateTaskT;
}

const InModelsSiderSection = ({
    task,
}: InModelsSiderSectionProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>In models</SiderSectionTitle>
            {(!task.in_models || task.in_models.length === 0) &&
                'No in models.'}
            {task.in_models && (
                <Fragment>
                    <p>Models from tasks:</p>
                    <Ul>
                        {task.in_models.map(({ traintuple_key }) => (
                            <li key={traintuple_key}>
                                <Link
                                    href={compilePath(PATHS.TASK, {
                                        key: traintuple_key,
                                    })}
                                >
                                    {traintuple_key}
                                </Link>
                            </li>
                        ))}
                    </Ul>
                </Fragment>
            )}
        </SiderSection>
    );
};

export default InModelsSiderSection;
