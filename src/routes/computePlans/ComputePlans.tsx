import axios from 'axios';
import { useLocation } from 'wouter';

import {
    VStack,
    Table,
    Thead,
    Tr,
    Th,
    Tbody as ChakraTbody,
    Box,
    Button,
    HStack,
    Flex,
} from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import { useCustomHyperparameters } from '@/hooks/useHyperparameters';
import useLocalStorageKeyItems from '@/hooks/useLocalStorageItems';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import useSearchFiltersEffect from '@/hooks/useSearchFiltersEffect';
import { useSyncedStringState } from '@/hooks/useSyncedState';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/hooks/useTableFilters';
import useWithAbortController from '@/hooks/useWithAbortController';
import { retrieveComputePlan } from '@/modules/computePlans/ComputePlansApi';
import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { compilePath, PATHS } from '@/routes';

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
    StatusTableFilterTag,
    TableFilterTags,
} from '@/components/TableFilterTags';
import {
    TableFilters,
    ComputePlanStatusTableFilter,
} from '@/components/TableFilters';
import TablePagination from '@/components/TablePagination';

import ComputePlanTr from './components/ComputePlanTr';
import ComputePlanTrSkeleton from './components/ComputePlanTrSkeleton';

const ComputePlans = (): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const {
        params: { page, search: searchFilters, match },
    } = useLocationWithParams();
    const [ordering] = useSyncedStringState('ordering', '-creation_date');
    const [, setLocation] = useLocation();
    const {
        items: selectedComputePlans,
        updateItem: updateSelectedComputePlan,
        addItem: selectComputePlan,
        removeItem: unselectComputePlan,
        clearItems: resetSelection,
    } = useLocalStorageKeyItems<ComputePlanT>('selected_compute_plans');
    const { isFavorite, onFavoriteChange } = useFavoriteComputePlans();
    const withAbortController = useWithAbortController();

    const selectedKeys = selectedComputePlans.map((cp) => cp.key);

    useSearchFiltersEffect(() => {
        const refreshSelected = async (abortController: AbortController) => {
            for (const computePlan of selectedComputePlans) {
                retrieveComputePlan(computePlan.key, {
                    signal: abortController.signal,
                }).then(
                    (response) => {
                        const refreshedComputePlan = response.data;
                        updateSelectedComputePlan(refreshedComputePlan);
                    },
                    (error) => {
                        // do nothing if the call has been voluntarily canceled
                        if (axios.isCancel(error)) {
                            return;
                        }
                        // remove from selected if there was an error
                        if (selectedKeys.includes(computePlan.key)) {
                            unselectComputePlan(computePlan);
                        }
                    }
                );
            }
        };

        const abortRefreshSelected = withAbortController(refreshSelected);
        const abortListComputePlans = dispatchWithAutoAbort(
            listComputePlans({
                filters: searchFilters,
                page,
                match,
                ordering,
            })
        );

        return () => {
            abortRefreshSelected();
            abortListComputePlans();
        };
    }, [searchFilters, page, match, ordering]);

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
        replaceCustomHyperparameters,
        clearCustomHyperparameters,
    } = useCustomHyperparameters();
    const activeHyperparameters = customHyperparameters.length
        ? customHyperparameters
        : HYPERPARAMETERS;

    const onSelectionChange = (computePlan: ComputePlanT) => () => {
        if (selectedKeys.includes(computePlan.key)) {
            // remove CP from selection
            unselectComputePlan(computePlan);
        } else {
            // add CP to selection
            selectComputePlan(computePlan);
        }
    };

    const onClear = () => {
        resetSelection();
    };

    const onCompare = () => {
        setLocation(
            compilePath(PATHS.COMPARE, { keys: selectedKeys.join(',') })
        );
    };

    const context = useTableFiltersContext('compute_plan');
    const { onPopoverOpen } = context;

    return (
        <TableFiltersContext.Provider value={context}>
            <VStack
                paddingY="5"
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
                        </TableFilters>
                        <SearchBar />
                    </HStack>
                    <HStack spacing="4">
                        {selectedKeys.length > 0 && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onClear}
                                disabled={selectedKeys.length === 0}
                            >
                                Clear
                            </Button>
                        )}
                        {HYPERPARAMETERS && (
                            <CustomColumnsModal
                                computePlans={computePlans}
                                customHyperparameters={customHyperparameters}
                                replaceCustomHyperparameters={
                                    replaceCustomHyperparameters
                                }
                                clearCustomHyperparameters={
                                    clearCustomHyperparameters
                                }
                            />
                        )}
                        <Button
                            marginLeft={16}
                            size="sm"
                            colorScheme="teal"
                            onClick={onCompare}
                            disabled={selectedKeys.length < 2}
                        >
                            {selectedKeys.length < 2
                                ? 'Select compute plans to compare'
                                : `Compare ${selectedKeys.length} compute plans`}
                        </Button>
                    </HStack>
                </Flex>
                <Box paddingX="6">
                    <TableFilterTags>
                        <StatusTableFilterTag />
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
                                    openFilters={() => onPopoverOpen(0)}
                                    options={
                                        MELLODDY
                                            ? [
                                                  {
                                                      label: 'Name',
                                                      asc: {
                                                          label: 'Sort name A -> Z',
                                                          value: 'metadata__name',
                                                      },
                                                      desc: {
                                                          label: 'Sort name Z -> A',
                                                          value: '-metadata__name',
                                                      },
                                                  },
                                              ]
                                            : [
                                                  {
                                                      label: 'Tag',
                                                      asc: {
                                                          label: 'Sort tag A -> Z',
                                                          value: 'tag',
                                                      },
                                                      desc: {
                                                          label: 'Sort tag Z -> A',
                                                          value: '-tag',
                                                      },
                                                  },
                                              ]
                                    }
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
                                    openFilters={() => onPopoverOpen(0)}
                                    options={[
                                        {
                                            label: 'Creation',
                                            desc: {
                                                label: 'Sort creation newest first',
                                                value: '-creation_date',
                                            },
                                            asc: {
                                                label: 'Sort creation oldest first',
                                                value: 'creation_date',
                                            },
                                        },
                                    ]}
                                    {...bottomBorderProps}
                                />
                                <OrderingTh
                                    openFilters={() => onPopoverOpen(0)}
                                    minWidth="300px"
                                    whiteSpace="nowrap"
                                    options={[
                                        {
                                            label: 'Start date',
                                            asc: {
                                                label: 'Sort start date newest first',
                                                value: 'start_date',
                                            },
                                            desc: {
                                                label: 'Sort start date oldest first',
                                                value: '-start_date',
                                            },
                                        },
                                        {
                                            label: 'End date',
                                            asc: {
                                                label: 'Sort end date newest first',
                                                value: 'end_date',
                                            },
                                            desc: {
                                                label: 'Sort end date oldest first',
                                                value: '-end_date',
                                            },
                                        },
                                    ]}
                                />
                                {activeHyperparameters.map((hp) => (
                                    <OrderingTh
                                        key={hp}
                                        minWidth="125px"
                                        openFilters={() => onPopoverOpen(0)}
                                        options={[
                                            {
                                                label: hp,
                                                asc: {
                                                    label: `Sort ${hp} A -> Z`,
                                                    value: `metadata__${hp}`,
                                                },
                                                desc: {
                                                    label: `Sort ${hp} Z -> A`,
                                                    value: `-metadata__${hp}`,
                                                },
                                            },
                                        ]}
                                        {...bottomBorderProps}
                                    />
                                ))}
                            </Tr>
                        </Thead>
                        <ChakraTbody>
                            {selectedComputePlans.map((computePlan) => (
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
                                    highlighted={true}
                                    hyperparametersList={activeHyperparameters}
                                />
                            ))}
                        </ChakraTbody>
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
                                computePlans
                                    .filter(
                                        (computePlan) =>
                                            !selectedKeys.includes(
                                                computePlan.key
                                            )
                                    )
                                    .map((computePlan) => (
                                        <ComputePlanTr
                                            key={computePlan.key}
                                            computePlan={computePlan}
                                            isSelected={selectedKeys.includes(
                                                computePlan.key
                                            )}
                                            onSelectionChange={onSelectionChange(
                                                computePlan
                                            )}
                                            isFavorite={isFavorite(
                                                computePlan.key
                                            )}
                                            onFavoriteChange={onFavoriteChange(
                                                computePlan.key
                                            )}
                                            highlighted={false}
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
            </VStack>
        </TableFiltersContext.Provider>
    );
};

export default ComputePlans;
