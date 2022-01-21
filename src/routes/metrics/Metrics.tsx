import { RootState } from '@/store';

import MetricDrawer from './components/MetricDrawer';
import {
    VStack,
    HStack,
    Thead,
    Tr,
    Th,
    Td,
    Box,
    Text,
    Skeleton,
} from '@chakra-ui/react';

import { listMetrics } from '@/modules/metrics/MetricsSlice';
import { MetricType } from '@/modules/metrics/MetricsTypes';

import { formatDate } from '@/libs/utils';

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
    AssetsTable,
    AssetsTablePermissionsTh,
} from '@/components/AssetsTable';
import PermissionTag from '@/components/PermissionTag';
import SearchBar from '@/components/SearchBar';
import { ClickableTr, EmptyTr, TableSkeleton, Tbody } from '@/components/Table';
import {
    OwnerTableFilterTag,
    TableFilterTags,
} from '@/components/TableFilterTags';
import { OwnerTableFilter, TableFilters } from '@/components/TableFilters';
import TablePagination from '@/components/TablePagination';
import TableTitle from '@/components/TableTitle';

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
        <Box padding="6" marginLeft="auto" marginRight="auto">
            <MetricDrawer />
            <VStack marginBottom="2.5" spacing="2.5" alignItems="flex-start">
                <TableTitle title="Metrics" />
                <HStack spacing="2.5">
                    <TableFilters asset="metric">
                        <OwnerTableFilter />
                    </TableFilters>
                    <SearchBar asset="metric" />
                </HStack>
                <TableFilterTags asset="metric">
                    <OwnerTableFilterTag />
                </TableFilterTags>
                <Box
                    backgroundColor="white"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="gray.100"
                >
                    <AssetsTable>
                        <Thead>
                            <Tr>
                                <Th>Name / Creation / Owner</Th>
                                <AssetsTablePermissionsTh />
                            </Tr>
                        </Thead>
                        <Tbody data-cy={metricsLoading ? 'loading' : 'loaded'}>
                            {!metricsLoading && metrics.length === 0 && (
                                <EmptyTr nbColumns={2} asset="metric" />
                            )}
                            {metricsLoading ? (
                                <TableSkeleton
                                    itemCount={metricsCount}
                                    currentPage={page}
                                    rowHeight="73px"
                                >
                                    <Td>
                                        <Skeleton>
                                            <Text fontSize="sm">
                                                Lorem ipsum dolor sit amet
                                            </Text>
                                            <Text fontSize="xs">
                                                Created on YYYY-MM-DD HH:MM:SS
                                                by Foo
                                            </Text>
                                        </Skeleton>
                                    </Td>
                                    <Td textAlign="right">
                                        <Skeleton width="100px" height="20px" />
                                    </Td>
                                </TableSkeleton>
                            ) : (
                                metrics.map((metric) => (
                                    <ClickableTr
                                        key={metric.key}
                                        onClick={() =>
                                            setLocationWithParams(
                                                compilePath(PATHS.METRIC, {
                                                    key: metric.key,
                                                })
                                            )
                                        }
                                    >
                                        <Td>
                                            <Text fontSize="sm">
                                                {metric.name}
                                            </Text>
                                            <Text fontSize="xs">{`Created on ${formatDate(
                                                metric.creation_date
                                            )} by ${metric.owner}`}</Text>
                                        </Td>
                                        <Td textAlign="right">
                                            <PermissionTag
                                                permission={
                                                    metric.permissions.process
                                                }
                                            />
                                        </Td>
                                    </ClickableTr>
                                ))
                            )}
                        </Tbody>
                    </AssetsTable>
                </Box>
                <TablePagination currentPage={page} itemCount={metricsCount} />
            </VStack>
        </Box>
    );
};

export default Metrics;
