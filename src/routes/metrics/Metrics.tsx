/** @jsxRuntime classic */

/** @jsx jsx */
import { RootState } from '@/store';

import { Fragment } from 'react';

import MetricSider from './components/MetricSider';
import { Flex } from '@chakra-ui/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { listMetrics } from '@/modules/metrics/MetricsSlice';
import { MetricType } from '@/modules/metrics/MetricsTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import {
    CreationDateSkeletonTd,
    CreationDateTd,
    creationDateWidth,
} from '@/components/CreationDateTableCells';
import { OwnerTableFilter } from '@/components/NodeTableFilters';
import PermissionCellContent from '@/components/PermissionCellContent';
import SearchBar from '@/components/SearchBar';
import Skeleton from '@/components/Skeleton';
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
    TableSkeleton,
} from '@/components/Table';
import TablePagination from '@/components/TablePagination';
import TableTitle from '@/components/TableTitle';
import PageLayout from '@/components/layout/PageLayout';

const Metrics = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        params: { page, search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    useSearchFiltersEffect(() => {
        dispatch(listMetrics({ filters: searchFilters, page }));
    }, [searchFilters, page]);

    const metrics: MetricType[] = useAppSelector(
        (state: RootState) => state.metrics.metrics
    );

    const metricsLoading = useAppSelector(
        (state: RootState) => state.metrics.metricsLoading
    );
    const metricsCount = useAppSelector((state) => state.metrics.metricsCount);

    const key = useKeyFromPath(PATHS.METRIC);

    useAssetListDocumentTitleEffect('Metrics list', key);

    return (
        <PageLayout
            siderVisible={!!key}
            sider={<MetricSider />}
            stickyHeader={
                <Fragment>
                    <Flex justifyContent="space-between" marginBottom="6">
                        <TableTitle title="Metrics" />
                        <SearchBar
                            assetOptions={[
                                { label: 'Metric', value: 'objective' },
                            ]}
                        />
                    </Flex>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th css={creationDateWidth}>Creation date</Th>
                                <Th css={nameColWidth}>Name</Th>
                                <Th css={ownerColWidth}>
                                    Owner
                                    <OwnerTableFilter assets={['objective']} />
                                </Th>
                                <Th css={permissionsColWidth}>Permissions</Th>
                            </Tr>
                        </Thead>
                    </Table>
                </Fragment>
            }
        >
            <Table
                css={css`
                    margin-top: 55px;
                `}
            >
                <Thead
                    css={css`
                        opacity: 0;
                        pointer-events: none;
                    `}
                >
                    <Tr>
                        <Th css={creationDateWidth}>Creation date</Th>
                        <Th css={nameColWidth}>Name</Th>
                        <Th css={ownerColWidth}>Owner</Th>
                        <Th css={permissionsColWidth}>Permissions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {!metricsLoading && metrics.length === 0 && (
                        <EmptyTr nbColumns={4} />
                    )}
                    {metricsLoading ? (
                        <TableSkeleton
                            itemCount={metricsCount}
                            currentPage={page}
                        >
                            <CreationDateSkeletonTd />
                            <Td>
                                <Skeleton width={500} height={12} />
                            </Td>
                            <Td>
                                <Skeleton width={80} height={12} />
                            </Td>
                            <Td>
                                <Skeleton width={150} height={12} />
                            </Td>
                        </TableSkeleton>
                    ) : (
                        metrics.map((metric) => (
                            <Tr
                                key={metric.key}
                                highlighted={metric.key === key}
                                onClick={() =>
                                    setLocationWithParams(
                                        compilePath(PATHS.METRIC, {
                                            key: metric.key,
                                        })
                                    )
                                }
                            >
                                <CreationDateTd
                                    creationDate={metric.creation_date}
                                />
                                <Td>{metric.name}</Td>
                                <Td>{metric.owner}</Td>
                                <Td>
                                    <PermissionCellContent
                                        permissions={metric.permissions}
                                    />
                                </Td>
                            </Tr>
                        ))
                    )}
                    <TablePagination
                        colSpan={4}
                        currentPage={page}
                        itemCount={metricsCount}
                        asset="objective"
                    />
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default Metrics;
