import { useEffect } from 'react';

import styled from '@emotion/styled';

import { retrieveComputePlan } from '@/modules/computePlans/ComputePlansSlice';

import { useAppDispatch, useAppSelector } from '@/hooks';
import useKeyFromPath from '@/hooks/useKeyFromPath';

import { ROUTES } from '@/routes';

import Skeleton from '@/components/Skeleton';
import Status from '@/components/Status';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const Header = styled.div`
    display: flex;
    margin-bottom: ${Spaces.medium};
    flex-direction: column;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: ${Spaces.small} 0;
`;

const Label = styled.span`
    margin-right: ${Spaces.small};
    font-size: ${Fonts.sizes.label};
    color: ${Colors.lightContent};
`;

const Title = styled.span``;

const ComputePlanHeader = (): JSX.Element => {
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );
    const computePlanLoading = useAppSelector(
        (state) => state.computePlans.computePlanLoading
    );
    const dispatch = useAppDispatch();
    const key =
        useKeyFromPath(ROUTES.COMPUTE_PLAN_CHART.path) ||
        useKeyFromPath(ROUTES.COMPUTE_PLAN_TASKS.path);

    useEffect(() => {
        if (key && (!computePlan || computePlan.key !== key)) {
            dispatch(retrieveComputePlan(key));
        }
    }, [key]);

    return (
        <Header>
            <Row>
                <Label>Key</Label>
                <Title>
                    {computePlanLoading && <Skeleton height={16} width={310} />}
                    {!computePlanLoading && computePlan?.key}
                </Title>
            </Row>
            <Row>
                <Label>Status</Label>
                {computePlanLoading && <Skeleton height={16} width={70} />}
                {!computePlanLoading && computePlan && (
                    <Status status={computePlan.status} />
                )}
            </Row>
        </Header>
    );
};

export default ComputePlanHeader;
