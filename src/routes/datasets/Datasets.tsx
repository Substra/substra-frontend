import { useEffect, useMemo } from 'react';

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
} from '@chakra-ui/react';

import {
    CreationDateTableFilter,
    LogsAccessTableFilter,
    OwnerTableFilter,
    PermissionsTableFilter,
    TableFilters,
} from '@/features/tableFilters';
import {
    DateFilterTag,
    LogsAccessTableFilterTag,
    OwnerTableFilterTag,
    PermissionsTableFilterTag,
    TableFilterTags,
} from '@/features/tableFilters/TableFilterTags';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/features/tableFilters/useTableFilters';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import {
    useCanAccessLogs,
    useCanProcess,
    useCreationDate,
    useMatch,
    useOrdering,
    useOwner,
    usePage,
} from '@/hooks/useSyncedState';
import { endOfDay, formatDate } from '@/libs/utils';
import { compilePath, PATHS } from '@/paths';
import useDatasetsStore from '@/routes/datasets/useDatasetsStores';

import PermissionTag from '@/components/PermissionTag';
import RefreshButton from '@/components/RefreshButton';
import SearchBar from '@/components/SearchBar';
import {
    AssetsTable,
    AssetsTablePermissionsTh,
} from '@/components/table/AssetsTable';
import OrderingTh from '@/components/table/OrderingTh';
import {
    ClickableTr,
    EmptyTr,
    TableSkeleton,
    Tbody,
} from '@/components/table/Table';
import TablePagination from '@/components/table/TablePagination';
import TableTitle from '@/components/table/TableTitle';

const Datasets = (): JSX.Element => {
    const [page] = usePage();
    const [match] = useMatch();
    const [canProcess] = useCanProcess();
    const [canAccessLogs] = useCanAccessLogs();
    const [ordering] = useOrdering('-creation_date');
    const [owner] = useOwner();
    const { creationDateAfter, creationDateBefore } = useCreationDate();
    const setLocationPreserveParams = useSetLocationPreserveParams();

    const { datasets, datasetsCount, fetchingDatasets, fetchDatasets } =
        useDatasetsStore();

    const fetchParams = useMemo(() => {
        return {
            page,
            ordering,
            match,
            owner,
            creation_date_after: creationDateAfter,
            creation_date_before: endOfDay(creationDateBefore),
            can_process: canProcess,
            can_access_logs: canAccessLogs,
        };
    }, [
        canAccessLogs,
        canProcess,
        creationDateAfter,
        creationDateBefore,
        match,
        ordering,
        owner,
        page,
    ]);
    useEffect(() => {
        const abort = fetchDatasets(fetchParams);
        return abort;
    }, [fetchDatasets, fetchParams]);

    const context = useTableFiltersContext('dataset');
    const { onPopoverOpen } = context;

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle('Datasets list'),
        []
    );

    return (
        <VStack
            paddingX="6"
            paddingY="8"
            marginX="auto"
            spacing="2.5"
            alignItems="stretch"
        >
            <TableFiltersContext.Provider value={context}>
                <TableTitle title="Datasets" />
                <Flex justifyContent="space-between">
                    <HStack spacing="2.5">
                        <TableFilters>
                            <OwnerTableFilter />
                            <CreationDateTableFilter />
                            <PermissionsTableFilter />
                            <LogsAccessTableFilter />
                        </TableFilters>
                        <SearchBar />
                    </HStack>
                    <RefreshButton
                        onClick={() => fetchDatasets(fetchParams)}
                        isLoading={fetchingDatasets}
                    />
                </Flex>
                <TableFilterTags>
                    <OwnerTableFilterTag />
                    <DateFilterTag
                        urlParam="creation_date"
                        label="Creation date"
                    />
                    <PermissionsTableFilterTag />
                    <LogsAccessTableFilterTag />
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
                                <AssetsTablePermissionsTh textAlign="left" />
                                <AssetsTablePermissionsTh>
                                    Logs access
                                </AssetsTablePermissionsTh>
                            </Tr>
                        </Thead>
                        <Tbody
                            data-cy={fetchingDatasets ? 'loading' : 'loaded'}
                        >
                            {!fetchingDatasets && datasets.length === 0 && (
                                <EmptyTr nbColumns={3} asset="dataset" />
                            )}
                            {fetchingDatasets ? (
                                <TableSkeleton
                                    itemCount={datasetsCount}
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
                                    <Td>
                                        <Skeleton width="100px" height="20px" />
                                    </Td>
                                    <Td textAlign="right">
                                        <Skeleton width="100px" height="20px" />
                                    </Td>
                                </TableSkeleton>
                            ) : (
                                datasets.map((dataset) => (
                                    <ClickableTr
                                        key={dataset.key}
                                        data-key={dataset.key}
                                        onClick={() =>
                                            setLocationPreserveParams(
                                                compilePath(PATHS.DATASET, {
                                                    key: dataset.key,
                                                })
                                            )
                                        }
                                    >
                                        <Td>
                                            <Text fontSize="sm">
                                                {dataset.name}
                                            </Text>
                                            <Text fontSize="xs">{`Created on ${formatDate(
                                                dataset.creation_date
                                            )} by ${dataset.owner}`}</Text>
                                        </Td>
                                        <Td>
                                            <PermissionTag
                                                permission={
                                                    dataset.permissions.process
                                                }
                                            />
                                        </Td>
                                        <Td textAlign="right">
                                            <PermissionTag
                                                permission={
                                                    dataset.logs_permission
                                                }
                                            />
                                        </Td>
                                    </ClickableTr>
                                ))
                            )}
                        </Tbody>
                    </AssetsTable>
                </Box>
                <TablePagination currentPage={page} itemCount={datasetsCount} />
            </TableFiltersContext.Provider>
        </VStack>
    );
};

export default Datasets;
