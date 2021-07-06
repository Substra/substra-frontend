import React, { useEffect } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import styled from '@emotion/styled';

import { useAppDispatch, useAppSelector } from '@/hooks';
import {
    retrieveComputePlan,
    retrieveComputePlanTestTasks,
} from '@/modules/computePlans/ComputePlansSlice';
import { PATHS, useKeyFromPath } from '@/routes';
import PerfsGraph, { DataType } from '@/components/PerfsGraph';
import { isEmpty } from '@/libs/utils';

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
`;

const PerfContainer = styled.div`
    width: 500px;
`;

const ComputePlanDetails = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_DETAILS);

    useEffect(() => {
        if (key) {
            dispatch(retrieveComputePlan(key))
                .then(unwrapResult)
                .then((computePlan) => {
                    dispatch(retrieveComputePlanTestTasks(computePlan.key));
                });
        }
    }, [key]);

    const computePlanTestTasks = useAppSelector(
        (state) => state.computePlans.computePlanTestTasks
    );

    const perfData: Record<string, DataType> = {};

    const sortedTasks = [...computePlanTestTasks].sort((a, b) => {
        return a.rank - b.rank;
    });

    sortedTasks.forEach((testTask) => {
        if (!perfData[testTask.dataset.worker]) {
            perfData[testTask.dataset.worker] = {
                x: [testTask.rank],
                y: [testTask.dataset.perf],
            };
        } else {
            perfData[testTask.dataset.worker] = {
                x: [...perfData[testTask.dataset.worker].x, testTask.rank],
                y: [
                    ...perfData[testTask.dataset.worker].y,
                    testTask.dataset.perf,
                ],
            };
        }
    });

    return (
        <Container>
            {!isEmpty(perfData) && (
                <PerfContainer>
                    <PerfsGraph data={perfData} />
                </PerfContainer>
            )}
        </Container>
    );
};

export default ComputePlanDetails;
