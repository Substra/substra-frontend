/** @jsxRuntime classic */
/** @jsx jsx */
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { Spaces, Fonts, Colors } from '@/assets/theme';
import { RiAddCircleLine } from 'react-icons/ri';
import Skeleton from '@/components/Skeleton';

export const LoadingNodeSiderSection = (): JSX.Element => {
    return (
        <NodeContainer>
            <Skeleton
                width={100}
                height={16}
                css={css`
                    margin-bottom: ${Spaces.extraSmall};
                `}
            />
            <Skeleton width={150} height={16} />
        </NodeContainer>
    );
};

const NodeContainer = styled.div`
    display: 'flex';
    flex-direction: 'column';
`;

const NodeTitle = styled.h3`
    font-size: ${Fonts.sizes.h3};
    font-weight: ${Fonts.weights.heavy};
    margin-bottom: ${Spaces.extraSmall};
`;

const NodeTasks = styled.span`
    font-size: ${Fonts.sizes.h3};
    font-weight: ${Fonts.weights.normal};
    color: ${Colors.content};
`;

const NodeTasksContainer = styled.div`
    display: flex;
    align-items: center;
    font-size: ${Fonts.sizes.smallBody};
    font-weight: ${Fonts.weights.light};
    color: ${Colors.lightContent};

    & > * {
        margin-right: ${Spaces.extraSmall};
    }
`;

type nodeProps = {
    title: string;
    waitingTasks: number;
};

const NodeSiderElement = ({ title, waitingTasks }: nodeProps): JSX.Element => {
    return (
        <NodeContainer>
            <NodeTitle>{title}</NodeTitle>
            <NodeTasksContainer>
                <RiAddCircleLine />
                <NodeTasks>{waitingTasks}</NodeTasks>
                {waitingTasks > 1 ? 'Tasks' : 'Task'} waiting to do
            </NodeTasksContainer>
        </NodeContainer>
    );
};

export default NodeSiderElement;
