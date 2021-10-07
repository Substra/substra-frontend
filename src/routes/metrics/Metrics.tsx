import { RootState } from '@/store';

import MetricSider from './components/MetricSider';
import { VStack, Table, Thead, Tr, Th, Tbody, Td, Box } from '@chakra-ui/react';

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
} from '@/components/CreationDateTableCells';
import { OwnerTableFilter } from '@/components/NodeTableFilters';
import PermissionCellContent from '@/components/PermissionCellContent';
import SearchBar from '@/components/SearchBar';
import Skeleton from '@/components/Skeleton';
import { ClickableTr, EmptyTr, TableSkeleton } from '@/components/Table';
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
            <MetricSider />
            <VStack marginBottom="2.5" spacing="2.5" alignItems="flex-start">
                <TableTitle title="Metrics" />
                <SearchBar asset="objective" />
                <Box
                    backgroundColor="white"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="gray.100"
                >
                    <Table size="sm">
                        <Thead>
                            <Tr>
                                <Th>Creation date</Th>
                                <Th>Name</Th>
                                <Th>
                                    Owner
                                    <OwnerTableFilter assets={['objective']} />
                                </Th>
                                <Th>Permissions</Th>
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
                                    </ClickableTr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Box>
                <TablePagination currentPage={page} itemCount={metricsCount} />
            </VStack>
        </Box>
    );
};

export default Metrics;
