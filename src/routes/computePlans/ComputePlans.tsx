/** @jsxRuntime classic */

/** @jsx jsx */
import { Fragment } from 'react';

import ComputePlanSider from './components/ComputePlansSider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { ComputePlanType } from '@/modules/computePlans/ComputePlansTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersLocation,
    useSearchFiltersEffect,
} from '@/hooks';

import { compilePath, PATHS, useKeyFromPath } from '@/routes';

import {
    CreationDateSkeletonTd,
    CreationDateTd,
    CreationDateTh,
} from '@/components/CreationDateTableCells';
import PageTitle from '@/components/PageTitle';
import SearchBar from '@/components/SearchBar';
import Skeleton from '@/components/Skeleton';
import Status from '@/components/Status';
import StatusTableFilter from '@/components/StatusTableFilter';
import { EmptyTr, Table, Tbody, Td, Th, Thead, Tr } from '@/components/Table';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';

const tagColWidth = css`
    width: 200px;
`;
const statusColWidth = css`
    width: 200px;
`;
const taskColWidth = css`
    width: 600px;
`;

const ComputePlans = (): JSX.Element => {
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

    const key = useKeyFromPath(PATHS.COMPUTE_PLANS_DETAILS);

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
                                <CreationDateTh />
                                <Th css={tagColWidth}>Tag</Th>
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
                        <CreationDateTh />
                        <Th css={tagColWidth}>Tag</Th>
                        <Th css={statusColWidth}>Status</Th>
                        <Th css={taskColWidth}>Tasks</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {!computePlansLoading && computePlans.length === 0 && (
                        <EmptyTr nbColumns={4} />
                    )}
                    {computePlansLoading
                        ? [1, 2, 3].map((index) => (
                              <Tr key={index}>
                                  <CreationDateSkeletonTd />
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
                                          compilePath(
                                              PATHS.COMPUTE_PLANS_DETAILS,
                                              {
                                                  key: computePlan.key,
                                              }
                                          ),
                                          searchFilters
                                      )
                                  }
                              >
                                  <CreationDateTd
                                      creationDate={computePlan.creation_date}
                                  />
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

export default ComputePlans;
