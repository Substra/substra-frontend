/** @jsx jsx */
import React, { useEffect, Fragment, useMemo } from 'react';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useLocation } from 'wouter';

import { Fonts, Spaces } from '@/assets/theme';
import KeySiderSection from '@/components/KeySiderSection';
import {
    retrieveComputePlan,
    retrieveComputePlanAggregateTasks,
    retrieveComputePlanCompositeTasks,
    retrieveComputePlanTestTasks,
    retrieveComputePlanTrainTasks,
} from '@/modules/computePlans/ComputePlansSlice';
import { compilePath, PATHS, useKeyFromPath } from '@/routes';
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
import NodeSiderElement, {
    LoadingNodeSiderSection,
} from '@/components/NodeSiderElement';
import { AnyTaskT, TaskStatus } from '@/modules/tasks/TasksTypes';
import { getTaskWorker } from '@/modules/tasks/TasksUtils';
import Button from '@/components/Button';

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

const FooterSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${Spaces.medium};
`;

const ComputePlanSider = (): JSX.Element => {
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();

    const [, setLocation] = useLocation();

    const key = useKeyFromPath(PATHS.COMPUTE_PLANS_DETAILS);

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

    const incrementNodeWaitingTasks = (count: number, status: TaskStatus) => {
        if (status === TaskStatus.waiting) {
            if (count === undefined) {
                return 1;
            } else {
                return ++count;
            }
        } else if (count === undefined) {
            return 0;
        }
        return count;
    };

    const getTasksNodes = (tasks: AnyTaskT[]) => {
        const nodes: Record<string, number> = {};
        tasks.forEach((task) => {
            const node = getTaskWorker(task);
            return (nodes[node] = incrementNodeWaitingTasks(
                nodes[node],
                task.status
            ));
        });

        return nodes;
    };

    const nodesList = useMemo(
        () =>
            getTasksNodes([
                ...computePlanTrainTasks,
                ...computePlanTestTasks,
                ...computePlanAggregateTasks,
                ...computePlanCompositeTasks,
            ]),
        [
            computePlanTrainTasks,
            computePlanTestTasks,
            computePlanAggregateTasks,
            computePlanCompositeTasks,
        ]
    );
    const nodesListLoading =
        computePlanTrainTasksLoading ||
        computePlanTestTasksLoading ||
        computePlanAggregateTasksLoading ||
        computePlanCompositeTasksLoading;

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
            footer={
                computePlan && (
                    <FooterSection>
                        <Button
                            fullWidth
                            onClick={() =>
                                setLocation(
                                    compilePath(PATHS.COMPUTE_PLAN_DETAILS, {
                                        key: computePlan.key,
                                    })
                                )
                            }
                        >
                            Explore compute plan
                        </Button>
                    </FooterSection>
                )
            }
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
            <SiderSection>
                <SiderSectionTitle>
                    Nodes running on compute plan
                </SiderSectionTitle>
                {nodesListLoading && <LoadingNodeSiderSection />}
                {!nodesListLoading &&
                    Object.entries(nodesList).map(([node, waitingTasks]) => {
                        return (
                            <NodeSiderElement
                                key={node}
                                title={node}
                                waitingTasks={waitingTasks}
                            />
                        );
                    })}
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