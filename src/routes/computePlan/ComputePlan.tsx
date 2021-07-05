/** @jsx jsx */
import React, { Fragment } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { ComputePlanType } from '@/modules/computePlans/ComputePlansTypes';
import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersLocation,
    useSearchFiltersEffect,
} from '@/hooks';
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
import SearchBar from '@/components/Searchbar';
import StatusTableFilter from '@/components/StatusTableFilter';

const tagColWidth = css`
    width: 200px;
`;
const statusColWidth = css`
    width: 200px;
`;
const taskColWidth = css`
    width: 600px;
`;

const ComputePlan = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();

    useSearchFiltersEffect(() => {
        dispatch(listComputePlans(searchFilters));
    }, [searchFilters]);

    const computePlans: ComputePlanType[] = useAppSelector(
        (state) => state.computePlans.computePlans
    );

    const computePlansLoading = useAppSelector(
        (state) => state.computePlans.computePlansLoading
    );

    const key = useKeyFromPath(PATHS.COMPUTE_PLAN);

    const pageTitleLinks = [
        {
            location: PATHS.COMPUTE_PLANS,
            title: 'Compute Plans',
            active: true,
        },
        {
            location: PATHS.TASKS,
            title: 'Tasks',
            active: false,
        },
    ];

    return (
        <PageLayout
            navigation={<Navigation />}
            sider={<ComputePlanSider />}
            siderVisible={!!key}
            stickyHeader={
                <Fragment>
                    <PageTitle links={pageTitleLinks} />
                    <SearchBar
                        assetOptions={[
                            {
                                label: 'Compute Plan',
                                value: 'compute_plan',
                            },
                        ]}
                    />
                    <Table>
                        <Thead>
                            <Tr>
                                <FirstTabTh css={tagColWidth}>Tag</FirstTabTh>
                                <Th css={statusColWidth}>
                                    Status
                                    <StatusTableFilter
                                        assets={['compute_plan']}
                                    />
                                </Th>
                                <Th css={taskColWidth}>Tasks</Th>
                            </Tr>
                        </Thead>
                    </Table>
                </Fragment>
            }
        >
            <PageTitle
                links={pageTitleLinks}
                css={css`
                    opacity: 0;
                    pointer-events: none;
                `}
            />
            <Table>
                <Thead>
                    <Tr>
                        <FirstTabTh css={tagColWidth}>Tag</FirstTabTh>
                        <Th css={statusColWidth}>Status</Th>
                        <Th css={taskColWidth}>Tasks</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {!computePlansLoading && computePlans.length === 0 && (
                        <EmptyTr nbColumns={3} />
                    )}
                    {computePlansLoading
                        ? [1, 2, 3].map((index) => (
                              <Tr key={index}>
                                  <Td>
                                      <Skeleton width={150} height={12} />
                                  </Td>
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
                                      setSearchFiltersLocation(
                                          compilePath(PATHS.COMPUTE_PLAN, {
                                              key: computePlan.key,
                                          }),
                                          searchFilters
                                      )
                                  }
                              >
                                  <Td>{computePlan.tag}</Td>
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
