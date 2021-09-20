/** @jsxRuntime classic */

/** @jsx jsx */
import { useEffect, Fragment, useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { unwrapResult } from '@reduxjs/toolkit';
import { useLocation } from 'wouter';

import {
    retrieveComputePlan,
    retrieveComputePlanAggregateTasks,
    retrieveComputePlanCompositeTasks,
    retrieveComputePlanTestTasks,
    retrieveComputePlanTrainTasks,
} from '@/modules/computePlans/ComputePlansSlice';
import {
    AnyTupleT,
    TupleStatus,
    TaskCategory,
} from '@/modules/tasks/TuplesTypes';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import Button from '@/components/Button';
import ExpandableSiderSection from '@/components/ExpandableSiderSection';
import KeySiderSection from '@/components/KeySiderSection';
import MetadataSiderSection, {
    LoadingMetadataSiderSection,
} from '@/components/MetadataSiderSection';
import NodeSiderElement, {
    LoadingNodeSiderSection,
} from '@/components/NodeSiderElement';
import ProgressBar from '@/components/ProgressBar';
import Sider from '@/components/Sider';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import Skeleton from '@/components/Skeleton';
import TaskSiderSection, {
    LoadingTaskSiderSection,
} from '@/components/TaskSiderSection';

import { Fonts, Spaces } from '@/assets/theme';

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
    const { setLocationWithParams } = useLocationWithParams();

    const [, setLocation] = useLocation();

    const key = useKeyFromPath(PATHS.COMPUTE_PLANS_DETAILS);

    useDocumentTitleEffect(
        (setDocumentTitle) => {
            if (key) {
                setDocumentTitle(`${key} (compute plan)`);
            }
        },
        [key]
    );

    const visible = !!key;

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (key) {
            dispatch(retrieveComputePlan(key))
                .then(unwrapResult)
                .then((computePlan) => {
                    dispatch(
                        retrieveComputePlanTrainTasks({
                            computePlanKey: computePlan.key,
                            page: 1,
                        })
                    );
                    dispatch(
                        retrieveComputePlanTestTasks({
                            computePlanKey: computePlan.key,
                            page: 1,
                        })
                    );
                    dispatch(
                        retrieveComputePlanAggregateTasks({
                            computePlanKey: computePlan.key,
                            page: 1,
                        })
                    );
                    dispatch(
                        retrieveComputePlanCompositeTasks({
                            computePlanKey: computePlan.key,
                            page: 1,
                        })
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

    const computePlanTestTasks = useAppSelector(
        (state) => state.computePlans.computePlanTestTasks
    );

    const computePlanCompositeTasks = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTasks
    );

    const computePlanAggregateTasks = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTasks
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
    const tasksLoading =
        computePlanTrainTasksLoading ||
        computePlanTestTasksLoading ||
        computePlanAggregateTasksLoading ||
        computePlanCompositeTasksLoading;

    const incrementNodeWaitingTasks = (count: number, status: TupleStatus) => {
        if (status === TupleStatus.waiting) {
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

    const computePlanFailedTask = useMemo(() => {
        if (!computePlan?.failed_task) {
            return undefined;
        }

        const tasks: Record<TaskCategory, AnyTupleT[]> = {
            [TaskCategory.train]: computePlanTrainTasks,
            [TaskCategory.test]: computePlanTestTasks,
            [TaskCategory.aggregate]: computePlanAggregateTasks,
            [TaskCategory.composite]: computePlanCompositeTasks,
        };

        const failedTask = computePlan.failed_task;
        return tasks[failedTask.category].find(
            (task) => task.key === failedTask.key
        );
    }, [
        computePlan,
        computePlanTrainTasks,
        computePlanTestTasks,
        computePlanCompositeTasks,
        computePlanAggregateTasks,
    ]);

    const getTasksNodes = (tasks: AnyTupleT[]) => {
        const nodes: Record<string, number> = {};
        tasks.forEach((task) => {
            return (nodes[task.worker] = incrementNodeWaitingTasks(
                nodes[task.worker],
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

    let percentage = 0;
    if (computePlan) {
        percentage = (computePlan.done_count / computePlan.task_count) * 100;
    }
    const formattedPercentage =
        percentage === 100 ? `${percentage}%` : `${percentage.toFixed(1)}%`;

    return (
        <Sider
            visible={visible}
            onCloseButtonClick={() =>
                setLocationWithParams(PATHS.COMPUTE_PLANS)
            }
            titleType="Compute plan details"
            title={
                computePlanLoading || !computePlan ? (
                    <Skeleton width={370} height={30} />
                ) : (
                    computePlan.tag
                )
            }
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
                        <PercentageNumber>
                            {isNaN(percentage) ? 'N/A' : formattedPercentage}
                        </PercentageNumber>
                        <ProgressBar percentage={percentage} />
                    </Fragment>
                )}
            </SiderSection>
            <SiderSection>
                <SiderSectionTitle>
                    Nodes running on compute plan
                </SiderSectionTitle>
                {tasksLoading && <LoadingNodeSiderSection />}
                {!tasksLoading &&
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
            {computePlan?.failed_task && (
                <SiderSection>
                    <SiderSectionTitle>Failed task</SiderSectionTitle>
                    {tasksLoading && <LoadingTaskSiderSection />}
                    {!tasksLoading && computePlanFailedTask && (
                        <TaskSiderSection task={computePlanFailedTask} />
                    )}
                </SiderSection>
            )}
            <ExpandableSiderSection title="Train tasks">
                {computePlanTrainTasksLoading && <LoadingTaskSiderSection />}
                {!computePlanTrainTasksLoading &&
                    computePlanTrainTasks.length === 0 && (
                        <TaskText>
                            This compute plan doesn't have any train tasks
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
                            This compute plan doesn't have any test tasks
                            attached
                        </TaskText>
                    )}
                {computePlanTestTasks.map((testTask) => (
                    <TaskSiderSection key={testTask.key} task={testTask} />
                ))}
            </ExpandableSiderSection>
            <ExpandableSiderSection title="Composite train tasks">
                {computePlanCompositeTasksLoading && (
                    <LoadingTaskSiderSection />
                )}
                {!computePlanCompositeTasksLoading &&
                    computePlanCompositeTasks.length === 0 && (
                        <TaskText>
                            This compute plan doesn't have any composite train
                            tasks attached
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
