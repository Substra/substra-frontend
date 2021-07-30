import { Fragment, useEffect, useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { unwrapResult } from '@reduxjs/toolkit';

import {
    retrieveComputePlanAggregateTasks,
    retrieveComputePlanCompositeTasks,
    retrieveComputePlanTestTasks,
    retrieveComputePlanTrainTasks,
} from '@/modules/computePlans/ComputePlansSlice';
import { AnyTaskT } from '@/modules/tasks/TasksTypes';
import { getTaskPerf, getTaskWorker } from '@/modules/tasks/TasksUtils';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';

import Skeleton from '@/components/Skeleton';
import Status from '@/components/Status';
import { EmptyTr, Table, Tbody, Td, Th, Thead, Tr } from '@/components/Table';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const thStyle = css`
    background: ${Colors.darkBackground};
    padding: ${Spaces.medium} ${Spaces.small};
    text-align: left;

    &:first-of-type {
        border-top-left-radius: 8px;
    }
    &:last-of-type {
        border-top-right-radius: 8px;
    }
`;

const statusColWidth = css`
    width: 150px;
`;

const workerColWidth = css`
    width: 200px;
`;

const executionColWidth = css`
    width: 100px;
`;

const computeColWidth = css`
    width: 200px;
`;

const rankColWidth = css`
    width: 100px;
`;

const performanceColWidth = css`
    width: 200px;
`;

const Label = styled.div`
    color: ${Colors.lightContent};
    font-size: ${Fonts.sizes.input};
    margin-bottom: ${Spaces.small};
`;

interface TypeButtonProps {
    active: boolean;
}

const TypeButton = styled.button<TypeButtonProps>`
    background: ${({ active }) => (active ? Colors.primary : 'white')};
    border-color: ${({ active }) => (active ? Colors.primary : Colors.border)};
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
    color: ${({ active }) => (active ? 'white' : Colors.lightContent)};
    height: 38px;
    margin-right: ${Spaces.medium};
    padding: ${Spaces.small} ${Spaces.medium};
    text-transform: uppercase;
`;

const TaskButtonsContainer = styled.div`
    display: flex;
    margin-bottom: ${Spaces.medium};
`;

const TaskList = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [selectedTask, setSelectedTask] = useState(0);
    const [tasks, setTasks] = useState<AnyTaskT[]>([]);
    const isLoading = false;

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    useEffect(() => {
        if (computePlan) {
            switch (selectedTask) {
                case 0:
                    dispatch(retrieveComputePlanTrainTasks(computePlan.key))
                        .then(unwrapResult)
                        .then((tasks) => {
                            setTasks(tasks);
                        });
                    break;

                case 1:
                    dispatch(retrieveComputePlanTestTasks(computePlan.key))
                        .then(unwrapResult)
                        .then((tasks) => {
                            setTasks(tasks);
                        });
                    break;

                case 2:
                    dispatch(retrieveComputePlanCompositeTasks(computePlan.key))
                        .then(unwrapResult)
                        .then((tasks) => {
                            setTasks(tasks);
                        });
                    break;

                case 3:
                    dispatch(retrieveComputePlanAggregateTasks(computePlan.key))
                        .then(unwrapResult)
                        .then((tasks) => {
                            setTasks(tasks);
                        });
                    break;

                default:
                    break;
            }
        }
    }, [selectedTask]);

    const renderTasksButtons = () => {
        const tasksTypes = [
            {
                id: 0,
                name: 'Train tasks',
            },
            {
                id: 1,
                name: 'Test tasks',
            },
            {
                id: 2,
                name: 'Composite tasks',
            },
            {
                id: 3,
                name: 'Aggregate tasks',
            },
        ];

        return (
            <Fragment>
                <Label>Task type</Label>
                <TaskButtonsContainer>
                    {tasksTypes.map((taskType) => (
                        <TypeButton
                            onClick={() => setSelectedTask(taskType.id)}
                            key={taskType.id}
                            active={selectedTask === taskType.id}
                        >
                            {taskType.name}
                        </TypeButton>
                    ))}
                </TaskButtonsContainer>
            </Fragment>
        );
    };

    return (
        <div>
            {renderTasksButtons()}
            <Table>
                <Thead>
                    <Tr>
                        <Th css={[thStyle, statusColWidth]}>Current status</Th>
                        <Th css={[thStyle, workerColWidth]}>Worker</Th>
                        <Th css={[thStyle, executionColWidth]}>
                            Execution time
                        </Th>
                        <Th css={[thStyle, computeColWidth]}>Compute plan</Th>
                        <Th css={[thStyle, rankColWidth]}>Rank</Th>
                        <Th css={[thStyle, performanceColWidth]}>
                            Performance
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {!isLoading && tasks.length === 0 && (
                        <EmptyTr nbColumns={7} />
                    )}
                    {isLoading
                        ? [1, 2, 3].map((index) => (
                              <Tr key={index}>
                                  <Td>
                                      <Skeleton width={150} height={12} />
                                  </Td>
                                  <Td>
                                      <Skeleton width={200} height={12} />
                                  </Td>
                                  <Td>
                                      <Skeleton width={100} height={12} />
                                  </Td>
                                  <Td>
                                      <Skeleton width={200} height={12} />
                                  </Td>
                                  <Td>
                                      <Skeleton width={100} height={12} />
                                  </Td>
                                  <Td>
                                      <Skeleton width={200} height={12} />
                                  </Td>
                              </Tr>
                          ))
                        : tasks.map((task) => {
                              return (
                                  <Tr key={task.key}>
                                      <Td>
                                          <Status status={task.status} />
                                      </Td>
                                      <Td>{getTaskWorker(task)}</Td>
                                      <Td>Coming soon</Td>
                                      <Td>{task.key}</Td>
                                      <Td>{task.rank}</Td>
                                      <Td>{getTaskPerf(task)}</Td>
                                  </Tr>
                              );
                          })}
                </Tbody>
            </Table>
        </div>
    );
};

export default TaskList;
