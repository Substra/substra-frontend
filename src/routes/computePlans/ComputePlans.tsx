import { useEffect } from 'react';

import {
    VStack,
    Table,
    Thead,
    Tr,
    Th,
    Box,
    HStack,
    Flex,
} from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import { useCustomHyperparameters } from '@/hooks/useHyperparameters';
import useLocalStorageKeyItems from '@/hooks/useLocalStorageItems';
import {
    useCreationDate,
    useEndDate,
    useKey,
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
    const [key] = useKey();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const {
        items: selectedComputePlans,
        addItem: selectComputePlan,
        removeItem: unselectComputePlan,
        clearItems: resetSelection,
    } = useLocalStorageKeyItems<{ key: string; name: string }>(
        'selected_compute_plans_'
    );
    // Adding an underscore at the end to create a new variable for selected compute plans.
    // This is needed because selected_compute_plans used to store full cp objects in local storage.
    // So it would cause a crash if users haven't deleted the old variable (which they probably won't bother doing).

    const selectedKeys = selectedComputePlans.map((cp) => cp.key);

    const { favorites, setFavorites, isFavorite, onFavoriteChange } =
        useFavoriteComputePlans();

    useEffect(
        () =>
            dispatchWithAutoAbort(
                listComputePlans({
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

    const {
        customHyperparameters,
        storeCustomHyperparameters,
        clearCustomHyperparameters,
    } = useCustomHyperparameters();
    const activeHyperparameters = customHyperparameters.length
        ? customHyperparameters
        : HYPERPARAMETERS;

    const onSelectionChange = (computePlan: ComputePlanT) => () => {
        if (selectedKeys.includes(computePlan.key)) {
            // remove CP from selection
            unselectComputePlan({
                key: computePlan.key,
                name: computePlan.tag,
            });
        } else {
            // add CP to selection
            selectComputePlan({
                key: computePlan.key,
                name: computePlan.tag,
            });
        }
    };

    const context = useTableFiltersContext('compute_plan');
    const { onPopoverOpen } = context;

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
                        <SearchBar placeholder="Search tag or key..." />
                    </HStack>
                    {HYPERPARAMETERS && (
                        <CustomColumnsModal
                            computePlans={computePlans}
                            customHyperparameters={customHyperparameters}
                            storeCustomHyperparameters={
                                storeCustomHyperparameters
                            }
                            clearCustomHyperparameters={
                                clearCustomHyperparameters
                            }
                        />
                    )}
                </Flex>
                <Box paddingX="6">
                    <TableFilterTags>
                        <StatusTableFilterTag />
                        <FavoritesTableFilterTag />
                        <DateFilterTag
                            urlParam="creation_date_before"
                            label="Max creation date"
                        />
                        <DateFilterTag
                            urlParam="creation_date_after"
                            label="Min creation date"
                        />
                        <DateFilterTag
                            urlParam="start_date_before"
                            label="Max start date"
                        />
                        <DateFilterTag
                            urlParam="start_date_after"
                            label="Min start date"
                        />
                        <DateFilterTag
                            urlParam="end_date_before"
                            label="Max end date"
                        />
                        <DateFilterTag
                            urlParam="end_date_after"
                            label="Min end date"
                        />
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
                                            label: 'Tag',
                                            asc: {
                                                label: 'Sort tag Z -> A',
                                                value: '-tag',
                                            },
                                            desc: {
                                                label: 'Sort tag A -> Z',
                                                value: 'tag',
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
                                                label: 'Sort status WAITING -> DONE',
                                                value: 'status',
                                            },
                                            desc: {
                                                label: 'Sort status DONE -> WAITING',
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
                                {activeHyperparameters.map((hp) => (
                                    <OrderingTh
                                        key={hp}
                                        minWidth="125px"
                                        options={[
                                            {
                                                label: hp,
                                                asc: {
                                                    label: `Sort ${hp} Z -> A`,
                                                    value: `-metadata__${hp}`,
                                                },
                                                desc: {
                                                    label: `Sort ${hp} A -> Z`,
                                                    value: `metadata__${hp}`,
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
                                    hyperparametersList={activeHyperparameters}
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
                                        hyperparametersList={
                                            activeHyperparameters
                                        }
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
