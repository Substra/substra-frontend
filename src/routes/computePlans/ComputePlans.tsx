import { useEffect, useMemo, useState } from 'react';

import {
    VStack,
    Table,
    Thead,
    Tr,
    Th,
    Box,
    HStack,
    Flex,
    Button,
} from '@chakra-ui/react';
import { RiDownloadLine } from 'react-icons/ri';

import useAppSelector from '@/hooks/useAppSelector';
import useCustomColumns from '@/hooks/useCustomColumns';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import { useLocalStorageKeyArrayState } from '@/hooks/useLocalStorageState';
import {
    useCreationDate,
    useEndDate,
    useFavoritesOnly,
    useMatch,
    useOrdering,
    usePage,
    useStartDate,
    useStatus,
} from '@/hooks/useSyncedState';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/hooks/useTableFilters';
import { downloadBlob } from '@/libs/request';
import { endOfDay } from '@/libs/utils';
import { exportPerformances } from '@/modules/computePlans/ComputePlansApi';
import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import BulkSelection from '@/components/BulkSelection';
import CustomColumnsModal from '@/components/CustomColumnsModal';
import OrderingTh from '@/components/OrderingTh';
import SearchBar from '@/components/SearchBar';
import {
    bottomBorderProps,
    bottomRightBorderProps,
    EmptyTr,
    Tbody,
} from '@/components/Table';
import {
    DateFilterTag,
    FavoritesTableFilterTag,
    StatusTableFilterTag,
    TableFilterTags,
} from '@/components/TableFilterTags';
import {
    TableFilters,
    ComputePlanStatusTableFilter,
    ComputePlanFavoritesTableFilter,
    CreationDateTableFilter,
    StartDateTableFilter,
    EndDateTableFilter,
} from '@/components/TableFilters';
import TablePagination from '@/components/TablePagination';

import ComputePlanTr from './components/ComputePlanTr';
import ComputePlanTrSkeleton from './components/ComputePlanTrSkeleton';

const ComputePlans = (): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-creation_date');
    const [status] = useStatus();
    const [favoritesOnly] = useFavoritesOnly();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const {
        state: selectedComputePlans,
        addItem: selectComputePlan,
        removeItem: unselectComputePlan,
        clearState: resetSelection,
    } = useLocalStorageKeyArrayState<{ key: string; name: string }>(
        'selected_compute_plans_'
    );
    // Adding an underscore at the end to create a new variable for selected compute plans.
    // This is needed because selected_compute_plans used to store full cp objects in local storage.
    // So it would cause a crash if users haven't deleted the old variable (which they probably won't bother doing).

    const selectedKeys = selectedComputePlans.map((cp) => cp.key);

    const { favorites, setFavorites, isFavorite, onFavoriteChange } =
        useFavoriteComputePlans();

    const key = useMemo(() => {
        return favoritesOnly ? favorites : null;
    }, [favoritesOnly, favorites]);

    useEffect(
        () =>
            dispatchWithAutoAbort(
                listComputePlans({
                    page,
                    match,
                    ordering,
                    status,
                    key,
                    creation_date_after: creationDateAfter,
                    creation_date_before: endOfDay(creationDateBefore),
                    start_date_after: startDateAfter,
                    start_date_before: endOfDay(startDateBefore),
                    end_date_after: endDateAfter,
                    end_date_before: endOfDay(endDateBefore),
                })
            ),
        [
            dispatchWithAutoAbort,
            page,
            match,
            ordering,
            status,
            key,
            creationDateAfter,
            creationDateBefore,
            startDateAfter,
            startDateBefore,
            endDateAfter,
            endDateBefore,
        ]
    );

    const computePlans: ComputePlanT[] = useAppSelector(
        (state) => state.computePlans.computePlans
    );

    const computePlansLoading = useAppSelector(
        (state) => state.computePlans.computePlansLoading
    );

    const computePlansCount = useAppSelector(
        (state) => state.computePlans.computePlansCount
    );

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle('Compute plans list'),
        []
    );

    const { columns, setColumns, clearColumns } = useCustomColumns();

    const onSelectionChange = (computePlan: ComputePlanT) => () => {
        if (selectedKeys.includes(computePlan.key)) {
            // remove CP from selection
            unselectComputePlan({
                key: computePlan.key,
                name: computePlan.name,
            });
        } else {
            // add CP to selection
            selectComputePlan({
                key: computePlan.key,
                name: computePlan.name,
            });
        }
    };

    const context = useTableFiltersContext('compute_plan');
    const { onPopoverOpen } = context;

    const [downloading, setDownloading] = useState(false);

    const download = async () => {
        setDownloading(true);
        const response = await exportPerformances({
            match,
            status,
            key,
            creation_date_after: creationDateAfter,
            creation_date_before: endOfDay(creationDateBefore),
            start_date_after: startDateAfter,
            start_date_before: endOfDay(startDateBefore),
            end_date_after: endDateAfter,
            end_date_before: endOfDay(endDateBefore),
        });
        downloadBlob(response.data, 'performances.csv');
        setDownloading(false);
    };

    const onRefresh = () => {
        dispatchWithAutoAbort(
            listComputePlans({
                page,
                match,
                ordering,
                status,
                key,
                creation_date_after: creationDateAfter,
                creation_date_before: endOfDay(creationDateBefore),
                start_date_after: startDateAfter,
                start_date_before: endOfDay(startDateBefore),
                end_date_after: endDateAfter,
                end_date_before: endOfDay(endDateBefore),
            })
        );
    };

    return (
        <TableFiltersContext.Provider value={context}>
            <VStack
                paddingTop="5"
                paddingBottom={selectedComputePlans.length ? '0' : '5'}
                spacing="2.5"
                alignItems="stretch"
                width="100%"
                bg="white"
                flexGrow={1}
                alignSelf="stretch"
                overflow="hidden"
            >
                <Flex justifyContent="space-between" paddingX="6">
                    <HStack spacing="2.5">
                        <TableFilters>
                            <ComputePlanStatusTableFilter />
                            <ComputePlanFavoritesTableFilter
                                favorites={favorites}
                            />
                            <CreationDateTableFilter />
                            <StartDateTableFilter />
                            <EndDateTableFilter />
                        </TableFilters>
                        <SearchBar placeholder="Search name or key..." />
                    </HStack>
                    <HStack spacing="2.5">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onRefresh}
                            isLoading={computePlansLoading}
                            loadingText="Loading"
                        >
                            Refresh
                        </Button>
                        <CustomColumnsModal
                            columns={columns}
                            setColumns={setColumns}
                            clearColumns={clearColumns}
                        />
                        {selectedKeys.length === 0 && (
                            <Button
                                size="sm"
                                isLoading={downloading}
                                loadingText="Downloading"
                                leftIcon={<RiDownloadLine />}
                                onClick={download}
                                variant="outline"
                            >
                                Download
                            </Button>
                        )}
                    </HStack>
                </Flex>
                <Box paddingX="6">
                    <TableFilterTags>
                        <StatusTableFilterTag />
                        <FavoritesTableFilterTag />
                        <DateFilterTag
                            urlParam="creation_date"
                            label="Creation date"
                        />
                        <DateFilterTag
                            urlParam="start_date"
                            label="Start date"
                        />
                        <DateFilterTag urlParam="end_date" label="End date" />
                    </TableFilterTags>
                </Box>
                <Box flexGrow={1} overflow="auto">
                    <Table size="md">
                        <Thead
                            position="sticky"
                            top={0}
                            backgroundColor="white"
                            zIndex="2"
                        >
                            <Tr>
                                <Th
                                    padding="0"
                                    minWidth="50px"
                                    position="sticky"
                                    left="0"
                                    zIndex="1"
                                    backgroundColor="white"
                                    {...bottomBorderProps}
                                ></Th>
                                <Th
                                    padding="0"
                                    minWidth="36px"
                                    position="sticky"
                                    left="50px"
                                    zIndex="1"
                                    backgroundColor="white"
                                    {...bottomBorderProps}
                                ></Th>
                                <OrderingTh
                                    minWidth="250px"
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
                                    ]}
                                    position="sticky"
                                    left="86px"
                                    zIndex="1"
                                    backgroundColor="white"
                                    {...bottomRightBorderProps}
                                />
                                <OrderingTh
                                    minWidth="255px"
                                    openFilters={() => onPopoverOpen(0)}
                                    options={[
                                        {
                                            label: 'Status',
                                            asc: {
                                                label: 'Sort status EMPTY -> FAILED',
                                                value: 'status',
                                            },
                                            desc: {
                                                label: 'Sort status FAILED -> EMPTY',
                                                value: '-status',
                                            },
                                        },
                                        {
                                            label: 'Tasks',
                                        },
                                    ]}
                                    {...bottomBorderProps}
                                />
                                <OrderingTh
                                    minWidth="255px"
                                    options={[
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
                                    ]}
                                    {...bottomBorderProps}
                                />
                                <OrderingTh
                                    minWidth="300px"
                                    whiteSpace="nowrap"
                                    options={[
                                        {
                                            label: 'Start date',
                                            asc: {
                                                label: 'Sort start date oldest first',
                                                value: '-start_date',
                                            },
                                            desc: {
                                                label: 'Sort start date newest first',
                                                value: 'start_date',
                                            },
                                        },
                                        {
                                            label: 'End date',
                                            asc: {
                                                label: 'Sort end date oldest first',
                                                value: '-end_date',
                                            },
                                            desc: {
                                                label: 'Sort end date newest first',
                                                value: 'end_date',
                                            },
                                        },
                                    ]}
                                />
                                {columns.map((column) => (
                                    <OrderingTh
                                        key={column}
                                        minWidth="125px"
                                        options={[
                                            {
                                                label: column,
                                                asc: {
                                                    label: `Sort ${column} Z -> A`,
                                                    value: `-metadata__${column}`,
                                                },
                                                desc: {
                                                    label: `Sort ${column} A -> Z`,
                                                    value: `metadata__${column}`,
                                                },
                                            },
                                        ]}
                                        {...bottomBorderProps}
                                    />
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody
                            data-cy={computePlansLoading ? 'loading' : 'loaded'}
                        >
                            {!computePlansLoading &&
                                computePlans.length === 0 && (
                                    <EmptyTr
                                        nbColumns={6}
                                        asset="compute_plan"
                                    />
                                )}
                            {computePlansLoading ? (
                                <ComputePlanTrSkeleton
                                    computePlansCount={computePlansCount}
                                    page={page}
                                    customColumns={columns}
                                />
                            ) : (
                                computePlans.map((computePlan) => (
                                    <ComputePlanTr
                                        key={computePlan.key}
                                        computePlan={computePlan}
                                        isSelected={selectedKeys.includes(
                                            computePlan.key
                                        )}
                                        onSelectionChange={onSelectionChange(
                                            computePlan
                                        )}
                                        isFavorite={isFavorite(computePlan.key)}
                                        onFavoriteChange={onFavoriteChange(
                                            computePlan.key
                                        )}
                                        customColumns={columns}
                                    />
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Box>
                <Box paddingX="6">
                    <TablePagination
                        currentPage={page}
                        itemCount={computePlansCount}
                    />
                </Box>
                {selectedComputePlans.length > 0 && (
                    <Box paddingX="4" paddingY="3" backgroundColor="teal.500">
                        <BulkSelection
                            selectedComputePlans={selectedComputePlans}
                            unselectComputePlan={unselectComputePlan}
                            resetSelection={resetSelection}
                            favorites={favorites}
                            setFavorites={setFavorites}
                            isFavorite={isFavorite}
                        />
                    </Box>
                )}
            </VStack>
        </TableFiltersContext.Provider>
    );
};

export default ComputePlans;
