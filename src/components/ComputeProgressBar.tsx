import styled from '@emotion/styled';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

type ProgressBarProps = {
    computePlan: ComputePlanT;
};

const Container = styled.div<{
    task_count: number;
}>`
    width: 100%;
    height: 0.5rem;
    background-color: ${({ task_count }) => (task_count ? '#CBD5E0' : '#fff')};
    border-radius: 20px !important;
    margin-top: var(--chakra-space-2);
    margin-bottom: var(--chakra-space-2);
    display: flex;

    & div:last-child {
        &:after {
            display: none;
        }
    }

    & div:first-of-type {
        border-radius: 4px;
    }
`;

const Item = styled.div<{
    task_count: number;
    value: number;
    color?: string;
}>`
    display: ${({ value }) => (value ? 'block' : 'none')};
    height: 100%;
    background-color: ${({ color }) => (color ? color : '#CBD5E0')};
    left: calc(50% - 225px / 2 + 0px);
    border-radius: 0px 4px 4px 0px;
    width: ${({ task_count, value }) => (value / task_count) * 100}%;

    &:after {
        position: relative;
        content: ' ';
        color: transparent;
        border-radius: 0 0 10px 0;
        -moz-border-radius: 0 0 10px 0;
        -webkit-border-radius: 0 10px 10px 0;
        -webkit-box-shadow: 10px 0 0 0 #fff;
        box-shadow: 2px 0 0 0 #fff;
        display: block;
        height: 0.5rem;
    }
`;

const ProgressBar = ({ computePlan }: ProgressBarProps): JSX.Element => {
    return (
        <Container task_count={computePlan.task_count}>
            {computePlan.task_count == 0 && <Item task_count={1} value={1} />}
            {computePlan.done_count > 0 && (
                <Item
                    task_count={computePlan.task_count}
                    value={computePlan.done_count}
                    color="teal"
                />
            )}
            {computePlan.doing_count > 0 && (
                <Item
                    task_count={computePlan.task_count}
                    value={computePlan.doing_count}
                />
            )}
            {computePlan.failed_count > 0 && (
                <Item
                    task_count={computePlan.task_count}
                    value={computePlan.failed_count}
                    color="#F70B60"
                />
            )}
            {computePlan.canceled_count > 0 && (
                <Item
                    task_count={computePlan.task_count}
                    value={computePlan.canceled_count}
                    color="#718096"
                />
            )}
            {computePlan.waiting_count > 0 && (
                <Item
                    task_count={computePlan.task_count}
                    value={computePlan.waiting_count}
                />
            )}
            {computePlan.todo_count > 0 && (
                <Item
                    task_count={computePlan.task_count}
                    value={computePlan.todo_count}
                />
            )}
        </Container>
    );
};

export default ProgressBar;
