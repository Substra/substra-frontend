/** @jsx jsx */
import React, { Fragment } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { MetricType } from '@/modules/metrics/MetricsTypes';
import { listMetrics } from '@/modules/metrics/MetricsSlice';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';
import { RootState } from '@/store';
import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersLocation,
    useSearchFiltersEffect,
} from '@/hooks';
import PermissionCellContent from '@/components/PermissionCellContent';
import {
    EmptyTr,
    nameColWidth,
    ownerColWidth,
    permissionsColWidth,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@/components/Table';
import MetricSider from './components/MetricSider';
import { compilePath, PATHS, useKeyFromPath } from '@/routes';
import PageTitle from '@/components/PageTitle';
import Skeleton from '@/components/Skeleton';
import OwnerTableFilter from '@/components/OwnerTableFilter';
import { AssetType } from '@/modules/common/CommonTypes';

const Metrics = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();

    useSearchFiltersEffect(() => {
        dispatch(listMetrics(searchFilters));
    }, [searchFilters]);

    const metrics: MetricType[] = useAppSelector(
        (state: RootState) => state.metrics.metrics
    );

    const metricsLoading = useAppSelector(
        (state: RootState) => state.metrics.metricsLoading
    );

    const key = useKeyFromPath(PATHS.METRIC);

    const pageTitleLinks = [
        { location: PATHS.ALGOS, title: 'Algorithms', active: false },
        { location: PATHS.METRICS, title: 'Metrics', active: true },
    ];

    return (
        <PageLayout
            siderVisible={!!key}
            navigation={<Navigation />}
            sider={<MetricSider />}
            stickyHeader={
                <Fragment>
                    <PageTitle links={pageTitleLinks} />
                    <Table>
                        <Thead>
                            <Tr>
                                <Th css={nameColWidth}>Name</Th>
                                <Th css={ownerColWidth}>
                                    Owner
                                    <OwnerTableFilter
                                        assets={[AssetType.metric]}
                                    />
                                </Th>
                                <Th css={permissionsColWidth}>Permissions</Th>
                            </Tr>
                        </Thead>
                    </Table>
                </Fragment>
            }
        >
            <PageTitle
                css={css`
                    opacity: 0;
                    pointer-events: none;
                `}
                links={pageTitleLinks}
            />
            <Table>
                <Thead
                    css={css`
                        opacity: 0;
                        pointer-events: none;
                    `}
                >
                    <Tr>
                        <Th css={nameColWidth}>Name</Th>
                        <Th css={ownerColWidth}>Owner</Th>
                        <Th css={permissionsColWidth}>Permissions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {!metricsLoading && metrics.length === 0 && (
                        <EmptyTr nbColumns={4} />
                    )}
                    {metricsLoading
                        ? [1, 2, 3].map((index) => (
                              <Tr key={index}>
                                  <Td>
                                      <Skeleton width={500} height={12} />
                                  </Td>
                                  <Td>
                                      <Skeleton width={80} height={12} />
                                  </Td>
                                  <Td>
                                      <Skeleton width={150} height={12} />
                                  </Td>
                              </Tr>
                          ))
                        : metrics.map((metric) => (
                              <Tr
                                  key={metric.key}
                                  highlighted={metric.key === key}
                                  onClick={() =>
                                      setSearchFiltersLocation(
                                          compilePath(PATHS.METRIC, {
                                              key: metric.key,
                                          }),
                                          searchFilters
                                      )
                                  }
                              >
                                  <Td>{metric.name}</Td>
                                  <Td>{metric.owner}</Td>
                                  <Td>
                                      <PermissionCellContent
                                          permission={
                                              metric.permissions.process
                                          }
                                      />
                                  </Td>
                              </Tr>
                          ))}
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default Metrics;
