/** @jsx jsx */
import React, { useEffect, Fragment } from 'react';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { unwrapResult } from '@reduxjs/toolkit';

import { Fonts, Spaces } from '@/assets/theme';
import KeySiderSection from '@/components/KeySiderSection';
import {
    retrieveComputePlan,
    retrieveComputePlanAggregateTasks,
    retrieveComputePlanCompositeTasks,
    retrieveComputePlanTestTasks,
    retrieveComputePlanTrainTasks,
} from '@/modules/computePlans/ComputePlansSlice';
import { PATHS, useKeyFromPath } from '@/routes';
import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersLocation,
} from '@/hooks';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import ProgressBar from '@/components/ProgressBar';
import TaskSiderSection, {
    LoadingTaskSiderSection,
} from '@/components/TaskSiderSection';
import ExpandableSiderSection from '@/components/ExpandableSiderSection';
import Sider from '@/components/Sider';
import MetadataSiderSection, {
    LoadingMetadataSiderSection,
} from '@/components/MetadataSiderSection';
import Skeleton from '@/components/Skeleton';

const PercentageNumber = styled.div`
    font-size: ${Fonts.sizes.h2};
    font-weight: ${Fonts.weights.heavy};
    margin-bottom: ${Spaces.small};
`;

const TaskText = styled.div`
    padding: ${Spaces.medium} ${Spaces.large};
`;

const skeletonCss = css`
    margin: ${Spaces.small} 0;
`;

const ComputePlanSider = (): JSX.Element => {
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN);

    const visible = !!key;

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (key) {
            dispatch(retrieveComputePlan(key))
                .then(unwrapResult)
                .then((computePlan) => {
                    dispatch(retrieveComputePlanTrainTasks(computePlan.key));
                    dispatch(retrieveComputePlanTestTasks(computePlan.key));
                    dispatch(
                        retrieveComputePlanAggregateTasks(computePlan.key)
                    );
                    dispatch(
                        retrieveComputePlanCompositeTasks(computePlan.key)
                    );
                });
        }
    }, [key]);

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );
    const computePlanLoading = useAppSelector(
        (state) => state.computePlans.computePlanLoading
    );

    const computePlanTrainTasks = useAppSelector(
        (state) => state.computePlans.computePlanTrainTasks
    );

    const computePlanTrainTasksLoading = useAppSelector(
        (state) => state.computePlans.computePlanTrainTasksLoading
    );
    const computePlanTestTasksLoading = useAppSelector(
        (state) => state.computePlans.computePlanTestTasksLoading
    );
    const computePlanCompositeTasksLoading = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTasksLoading
    );
    const computePlanAggregateTasksLoading = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTasksLoading
    );

    const computePlanTestTasks = useAppSelector(
        (state) => state.computePlans.computePlanTestTasks
    );

    const computePlanCompositeTasks = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTasks
    );

    const computePlanAggregateTasks = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTasks
    );

    let percentage = 0;
    if (computePlan) {
        percentage = (computePlan.done_count / computePlan.tuple_count) * 100;
    }

    return (
        <Sider
            visible={visible}
            onCloseButtonClick={() =>
                setSearchFiltersLocation(PATHS.COMPUTE_PLANS, searchFilters)
            }
            titleType="Compute plan details"
            title=""
        >
            <KeySiderSection assetKey={key || ''} />

            {computePlanLoading && <LoadingMetadataSiderSection />}
            {!computePlanLoading && computePlan && (
                <MetadataSiderSection metadata={computePlan.metadata} />
            )}

            <SiderSection>
                <SiderSectionTitle>Completion</SiderSectionTitle>
                {computePlanLoading && !computePlan && (
                    <Fragment>
                        <Skeleton css={skeletonCss} width={50} height={16} />
                        <Skeleton css={skeletonCss} width={200} height={16} />
                    </Fragment>
                )}
                {!computePlanLoading && computePlan && (
                    <Fragment>
                        <PercentageNumber>{percentage}%</PercentageNumber>
                        <ProgressBar percentage={percentage} />
                    </Fragment>
                )}
            </SiderSection>

            <ExpandableSiderSection title="Train tasks">
                {computePlanTrainTasksLoading && <LoadingTaskSiderSection />}
                {!computePlanTrainTasksLoading &&
                    computePlanTrainTasks.length === 0 && (
                        <TaskText>
                            This compute plan doesn't have any traintasks
                            attached
                        </TaskText>
                    )}
                {computePlanTrainTasks.map((trainTask) => (
                    <TaskSiderSection key={trainTask.key} task={trainTask} />
                ))}
            </ExpandableSiderSection>
            <ExpandableSiderSection title="Test tasks">
                {computePlanTestTasksLoading && <LoadingTaskSiderSection />}
                {!computePlanTestTasksLoading &&
                    computePlanTestTasks.length === 0 && (
                        <TaskText>
                            This compute plan doesn't have any testtasks
                            attached
                        </TaskText>
                    )}
                {computePlanTestTasks.map((testTask) => (
                    <TaskSiderSection key={testTask.key} task={testTask} />
                ))}
            </ExpandableSiderSection>
            <ExpandableSiderSection title="Composite tasks">
                {computePlanCompositeTasksLoading && (
                    <LoadingTaskSiderSection />
                )}
                {!computePlanCompositeTasksLoading &&
                    computePlanCompositeTasks.length === 0 && (
                        <TaskText>
                            This compute plan doesn't have any composite tasks
                            attached
                        </TaskText>
                    )}
                {computePlanCompositeTasks.map((compositeTask) => (
                    <TaskSiderSection
                        key={compositeTask.key}
                        task={compositeTask}
                    />
                ))}
            </ExpandableSiderSection>
            <ExpandableSiderSection title="Aggregate tasks">
                {computePlanAggregateTasksLoading && (
                    <LoadingTaskSiderSection />
                )}
                {!computePlanAggregateTasksLoading &&
                    computePlanAggregateTasks.length === 0 && (
                        <TaskText>
                            This compute plan doesn't have any aggregate tasks
                            attached
                        </TaskText>
                    )}
                {computePlanAggregateTasks.map((aggregateTask) => (
                    <TaskSiderSection
                        key={aggregateTask.key}
                        task={aggregateTask}
                    />
                ))}
            </ExpandableSiderSection>
        </Sider>
    );
};

export default ComputePlanSider;
