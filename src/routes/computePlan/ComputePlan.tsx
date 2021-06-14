/** @jsx jsx */
import React, { Fragment, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { useLocation } from 'wouter';

import { ComputePlanType } from '@/modules/computePlans/ComputePlansTypes';
import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import Navigation from '@/components/layout/navigation/Navigation';
import PageLayout from '@/components/layout/PageLayout';
import { compilePath, PATHS, useKeyFromPath } from '@/routes';
import {
    EmptyTr,
    FirstTabTh,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@/components/Table';
import PageTitle from '@/components/PageTitle';
import ComputePlanSider from './components/ComputePlanSider';
import Status from '@/components/Status';
import Skeleton from '@/components/Skeleton';

const statusColWidth = css`
    width: 200px;
`;
const taskColWidth = css`
    width: 400px;
`;

const ComputePlan = (): JSX.Element => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(listComputePlans());
    }, [dispatch]);

    const computePlans: ComputePlanType[] = useAppSelector(
        (state) => state.computePlans.computePlans
    );

    const computePlansLoading = useAppSelector(
        (state) => state.computePlans.computePlansLoading
    );

    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN);

    return (
        <PageLayout
            navigation={<Navigation />}
            sider={<ComputePlanSider />}
            siderVisible={!!key}
            stickyHeader={
                <Fragment>
                    <PageTitle>Compute Plans</PageTitle>
                    <Table>
                        <Thead>
                            <Tr>
                                <FirstTabTh css={statusColWidth}>
                                    Status
                                </FirstTabTh>
                                <Th css={taskColWidth}>Tasks</Th>
                            </Tr>
                        </Thead>
                    </Table>
                </Fragment>
            }
        >
            <PageTitle>Compute Plan</PageTitle>
            <Table>
                <Thead>
                    <Tr>
                        <FirstTabTh css={statusColWidth}>Status</FirstTabTh>
                        <Th css={taskColWidth}>Tasks</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {!computePlansLoading && computePlans.length === 0 && (
                        <EmptyTr nbColumns={2} />
                    )}
                    {computePlansLoading
                        ? [1, 2, 3].map((index) => (
                              <Tr key={index}>
                                  <Td>
                                      <Skeleton width={150} height={12} />
                                  </Td>
                                  <Td>
                                      <Skeleton width={300} height={12} />
                                  </Td>
                              </Tr>
                          ))
                        : computePlans.map((computePlan) => (
                              <Tr
                                  key={computePlan.key}
                                  highlighted={computePlan.key === key}
                                  onClick={() =>
                                      setLocation(
                                          compilePath(PATHS.COMPUTE_PLAN, {
                                              key: computePlan.key,
                                          })
                                      )
                                  }
                              >
                                  <Td>
                                      <Status status={computePlan.status} />
                                  </Td>
                                  <Td>
                                      {computePlan.done_count}/
                                      {computePlan.tuple_count}
                                  </Td>
                              </Tr>
                          ))}
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default ComputePlan;
