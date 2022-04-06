import {
    VStack,
    HStack,
    Thead,
    Tr,
    Td,
    Box,
    Text,
    Skeleton,
} from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import useSearchFiltersEffect from '@/hooks/useSearchFiltersEffect';
import { useSyncedStringState } from '@/hooks/useSyncedState';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/hooks/useTableFilters';
import { formatDate } from '@/libs/utils';
import { listMetrics } from '@/modules/metrics/MetricsSlice';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import { compilePath, PATHS } from '@/routes';
import { RootState } from '@/store';

import {
    AssetsTable,
    AssetsTablePermissionsTh,
} from '@/components/AssetsTable';
import OrderingTh from '@/components/OrderingTh';
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

import MetricDrawer from './components/MetricDrawer';

const Metrics = (): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const {
        params: { page, search: searchFilters, match },
        setLocationWithParams,
    } = useLocationWithParams();
    const [ordering] = useSyncedStringState('ordering', '-creation_date');

    useSearchFiltersEffect(() => {
        return dispatchWithAutoAbort(
            listMetrics({ filters: searchFilters, page, ordering, match })
        );
    }, [searchFilters, page, ordering, match]);

    const metrics: MetricType[] = useAppSelector(
        (state: RootState) => state.metrics.metrics
    );

    const metricsLoading = useAppSelector(
        (state: RootState) => state.metrics.metricsLoading
    );
    const metricsCount = useAppSelector((state) => state.metrics.metricsCount);

    const key = useKeyFromPath(PATHS.METRIC);

    useAssetListDocumentTitleEffect('Metrics list', key);

    const context = useTableFiltersContext('metric');
    const { onPopoverOpen } = context;

    return (
        <VStack
            paddingX="6"
            paddingY="8"
            marginX="auto"
            spacing="2.5"
            alignItems="flex-start"
        >
            <MetricDrawer />
            <TableFiltersContext.Provider value={context}>
                <TableTitle title="Metrics" />
                <HStack spacing="2.5">
                    <TableFilters>
                        <OwnerTableFilter />
                    </TableFilters>
                    <SearchBar />
                </HStack>
                <TableFilterTags>
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
                                <OrderingTh
                                    openFilters={() => onPopoverOpen(0)}
                                    options={[
                                        {
                                            label: 'Name',
                                            asc: {
                                                label: 'Sort name A -> Z',
                                                value: 'name',
                                            },
                                            desc: {
                                                label: 'Sort name Z -> A',
                                                value: '-name',
                                            },
                                        },
                                        {
                                            label: 'Creation',
                                            asc: {
                                                label: 'Sort creation newest first',
                                                value: 'creation_date',
                                            },
                                            desc: {
                                                label: 'Sort creation oldest first',
                                                value: '-creation_date',
                                            },
                                        },
                                        {
                                            label: 'Owner',
                                            asc: {
                                                label: 'Sort owner A -> Z',
                                                value: 'owner',
                                            },
                                            desc: {
                                                label: 'Sort owner Z -> A',
                                                value: '-owner',
                                            },
                                        },
                                    ]}
                                />
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
            </TableFiltersContext.Provider>
        </VStack>
    );
};

export default Metrics;
