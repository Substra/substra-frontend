/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';

import { AnyTupleT, TupleStatus } from '@/modules/tasks/TuplesTypes';

import Skeleton from '@/components/Skeleton';
import Status from '@/components/Status';

import { Fonts, Spaces } from '@/assets/theme';

export const LoadingTaskSiderSection = (): JSX.Element => (
    <TaskSiderSectionContainer>
        <Skeleton
            width={200}
            height={16}
            css={css`
                margin-bottom: ${Spaces.extraSmall};
            `}
        />
        <Skeleton
            width={300}
            height={16}
            css={css`
                margin-bottom: ${Spaces.small};
            `}
        />
        <Skeleton
            width={200}
            height={12}
            css={css`
                margin-bottom: ${Spaces.small};
            `}
        />
    </TaskSiderSectionContainer>
);

const TaskSiderSectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${Spaces.small} ${Spaces.large};
`;

const Key = styled.span`
    margin: ${Spaces.small} 0;
    font-weight: ${Fonts.weights.heavy};
    font-size: ${Fonts.sizes.input};
`;

const WorkerSection = styled.div`
    font-size: ${Fonts.sizes.label};
    margin-bottom: ${Spaces.small};
`;

const TaskType = styled.div`
    font-size: ${Fonts.sizes.label};
    margin-bottom: ${Spaces.small};
`;

const Worker = styled.span`
    font-weight: ${Fonts.weights.heavy};
    margin-left: ${Spaces.extraSmall};
`;

type TaskSiderSectionProps = {
    task: AnyTupleT;
};

const TaskSiderSection = ({ task }: TaskSiderSectionProps): JSX.Element => {
    return (
        <TaskSiderSectionContainer>
            <Status size="sm" status={task.status} />
            <Key>{task.key}</Key>
            {task.status === TupleStatus.failed && (
                <TaskType>type: {task.category}</TaskType>
            )}
            <WorkerSection>
                worker:
                <Worker>{task.worker}</Worker>
            </WorkerSection>
        </TaskSiderSectionContainer>
    );
};

export default TaskSiderSection;
