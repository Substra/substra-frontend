import { Fragment } from 'react';

import styled from '@emotion/styled';

import { useAppSelector } from '@/hooks';

import { PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import Skeleton from '@/components/Skeleton';
import StyledLink from '@/components/StyledLink';

import { Spaces } from '@/assets/theme';

const Rank = styled.div`
    margin-top: ${Spaces.small};
`;

const ComputePlanSiderSection = (): JSX.Element => {
    const task = useAppSelector((state) => state.tasks.task);
    const taskLoading = useAppSelector((state) => state.tasks.taskLoading);

    return (
        <SiderSection>
            <SiderSectionTitle>Compute plan</SiderSectionTitle>
            {taskLoading && <Skeleton width={300} height={16} />}
            {!taskLoading &&
                task &&
                (task.compute_plan_key ? (
                    <Fragment>
                        <StyledLink
                            href={PATHS.COMPUTE_PLANS_DETAILS.replace(
                                ':key',
                                task.compute_plan_key
                            )}
                        >
                            {task.compute_plan_key}
                        </StyledLink>
                        <Rank>{`Rank ${task.rank}`}</Rank>
                    </Fragment>
                ) : (
                    'This task is not part of any compute plan.'
                ))}
        </SiderSection>
    );
};

export default ComputePlanSiderSection;
