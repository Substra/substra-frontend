import { useEffect } from 'react';

import {
    VStack,
    HStack,
    Thead,
    Tr,
    Td,
    Box,
    Text,
    Skeleton,
    Flex,
    Button,
} from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import {
    useCanProcess,
    useCreationDate,
    useMatch,
    useOrdering,
    useOwner,
    usePage,
} from '@/hooks/useSyncedState';
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
    DateFilterTag,
    OwnerTableFilterTag,
    PermissionsTableFilterTag,
    TableFilterTags,
} from '@/components/TableFilterTags';
import {
    CreationDateTableFilter,
    OwnerTableFilter,
    PermissionsTableFilter,
    TableFilters,
} from '@/components/TableFilters';
import TablePagination from '@/components/TablePagination';
import TableTitle from '@/components/TableTitle';

import MetricDrawer from './components/MetricDrawer';

const Metrics = (): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const [page] = usePage();
    const [match] = useMatch();
    const [canProcess] = useCanProcess();
    const [ordering] = useOrdering('-creation_date');
    const [owner] = useOwner();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const setLocationPreserveParams = useSetLocationPreserveParams();

    useEffect(() => {
        return dispatchWithAutoAbort(
            listMetrics({
                page,
                ordering,
                match,
                owner,
                creation_date_after: creationDateAfter,
                creation_date_before: creationDateBefore,
                can_process: canProcess,
            })
        );
    }, [
        dispatchWithAutoAbort,
        page,
        ordering,
        match,
        owner,
        creationDateAfter,
        creationDateBefore,
        canProcess,
    ]);

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

    const onRefresh = () => {
        dispatchWithAutoAbort(
            listMetrics({
                page,
                ordering,
                match,
                owner,
                creation_date_after: creationDateAfter,
                creation_date_before: creationDateBefore,
                can_process: canProcess,
            })
        );
    };

    return (
        <VStack
            paddingX="6"
            paddingY="8"
            marginX="auto"
            spacing="2.5"
            alignItems="stretch"
        >
            <MetricDrawer />
            <TableFiltersContext.Provider value={context}>
                <TableTitle title="Metrics" />
                <Flex justifyContent="space-between">
                    <HStack spacing="2.5">
                        <TableFilters>
                            <OwnerTableFilter />
                            <CreationDateTableFilter />
                            <PermissionsTableFilter />
                        </TableFilters>
                        <SearchBar />
                    </HStack>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onRefresh}
                        isLoading={metricsLoading}
                        loadingText="Loading"
                    >
                        Refresh
                    </Button>
                </Flex>
                <TableFilterTags>
                    <OwnerTableFilterTag />
                    <DateFilterTag
                        urlParam="creation_date"
                        label="Creation date"
                    />
                    <PermissionsTableFilterTag />
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
                                                label: 'Sort name Z -> A',
                                                value: '-name',
                                            },
                                            desc: {
                                                label: 'Sort name A -> Z',
                                                value: 'name',
                                            },
                                        },
                                        {
                                            label: 'Creation',
                                            asc: {
                                                label: 'Sort creation oldest first',
                                                value: 'creation_date',
                                            },
                                            desc: {
                                                label: 'Sort creation newest first',
                                                value: '-creation_date',
                                            },
                                        },
                                        {
                                            label: 'Owner',
                                            asc: {
                                                label: 'Sort owner Z -> A',
                                                value: '-owner',
                                            },
                                            desc: {
                                                label: 'Sort owner A -> Z',
                                                value: 'owner',
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
                                            setLocationPreserveParams(
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
