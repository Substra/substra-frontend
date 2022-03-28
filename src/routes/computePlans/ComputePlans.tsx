import { useState } from 'react';

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
    Td,
    Icon,
    useDisclosure,
} from '@chakra-ui/react';
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import { useCustomHyperparameters } from '@/hooks/useHyperparameters';
import useLocalStorageItems from '@/hooks/useLocalStorageItems';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import useSearchFiltersEffect from '@/hooks/useSearchFiltersEffect';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/hooks/useTableFilters';
import useWithAbortController from '@/hooks/useWithAbortController';
import { SearchFilterType } from '@/libs/searchFilter';
import { getAllPages } from '@/modules/common/CommonUtils';
import * as API from '@/modules/computePlans/ComputePlansApi';
import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { compilePath, PATHS } from '@/routes';

import { ClickableTh } from '@/components/AssetsTable';
import CustomColumnsModal from '@/components/CustomColumnsModal';
import FullTextSearchBar from '@/components/FullTextSearchBar';
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
    const [, setLocation] = useLocation();
    const {
        items: selectedComputePlans,
        updateItem: updateSelectedComputePlan,
        addItem: selectComputePlan,
        removeItem: unselectComputePlan,
        clearItems: resetSelection,
    } = useLocalStorageItems<ComputePlanT>('selected_compute_plans');
    const {
        favorites,
        isFavorite,
        updateFavorite,
        addToFavorites,
        removeFromFavorites,
    } = useFavoriteComputePlans();

    const selectedKeys = selectedComputePlans.map((cp) => cp.key);
    const favoriteKeys = favorites.map((cp) => cp.key);
    const pinnedKeys = [
        ...favoriteKeys,
        ...selectedKeys.filter((key) => !favoriteKeys.includes(key)),
    ];

    const withAbortControllerFilterPinned = useWithAbortController();
    const withAbortControllerRefreshPinned = useWithAbortController();

    const [filteredPinnedKeys, setFilteredPinnedKeys] =
        useState<string[]>(pinnedKeys);
    const [refreshFilteredPinnedLoading, setRefreshFilteredPinnedLoading] =
        useState(true);

    useSearchFiltersEffect(() => {
        const refreshFilteredPinned = async (
            abortController: AbortController
        ) => {
            /**
             * Refresh the list of filtered pinned items matching the current filters
             */

            if (pinnedKeys.length === 0) {
                setFilteredPinnedKeys([]);
            } else {
                const pinnedSearchFilters = [
                    ...searchFilters,
                    ...pinnedKeys.map(
                        (key): SearchFilterType => ({
                            asset: 'compute_plan',
                            key: 'key',
                            value: key,
                        })
                    ),
                ];
                setRefreshFilteredPinnedLoading(true);
                try {
                    const filteredPinned = await getAllPages(
                        (page) =>
                            API.listComputePlans(
                                {
                                    searchFilters: pinnedSearchFilters,
                                    page,
                                    match,
                                },
                                { signal: abortController.signal }
                            ),
                        DEFAULT_PAGE_SIZE
                    );
                    // do not display pinned items not matching these searchFilters
                    setFilteredPinnedKeys(filteredPinned.map((cp) => cp.key));
                } catch (error) {
                    // do nothing
                }
            }
            setRefreshFilteredPinnedLoading(false);
        };
        return withAbortControllerFilterPinned(refreshFilteredPinned);
    }, [searchFilters, match]);

    useSearchFiltersEffect(() => {
        const refreshSelectedAndFavorites = async (
            abortController: AbortController
        ) => {
            const selectedAndFavorites = [
                ...favorites,
                ...selectedComputePlans.filter(
                    (selectedCp) =>
                        !favorites.find(
                            (favoriteCp) => favoriteCp.key === selectedCp.key
                        )
                ),
            ];
            for (const computePlan of selectedAndFavorites) {
                API.retrieveComputePlan(computePlan.key, {
                    signal: abortController.signal,
                }).then(
                    (response) => {
                        const refreshedComputePlan = response.data;
                        if (isFavorite(computePlan)) {
                            updateFavorite(refreshedComputePlan);
                        }
                        if (selectedKeys.includes(computePlan.key)) {
                            updateSelectedComputePlan(refreshedComputePlan);
                        }
                    },
                    (error) => {
                        // do nothing if the call has been voluntarily canceled
                        if (axios.isCancel(error)) {
                            return;
                        }
                        // remove from favorite/selected if there was an error
                        if (isFavorite(computePlan)) {
                            removeFromFavorites(computePlan);
                        }
                        if (selectedKeys.includes(computePlan.key)) {
                            unselectComputePlan(computePlan);
                        }
                    }
                );
            }
        };

        const abortRefreshFavorites = withAbortControllerRefreshPinned(
            refreshSelectedAndFavorites
        );
        const abortListComputePlans = dispatchWithAutoAbort(
            listComputePlans({ filters: searchFilters, page, match })
        );
        return () => {
            abortRefreshFavorites();
            abortListComputePlans();
        };
    }, [searchFilters, page, match]);

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
        ? customHyperparameters.map((hp) => hp.key)
        : HYPERPARAMETERS;

    const onSelectionChange = (computePlan: ComputePlanT) => () => {
        if (selectedKeys.includes(computePlan.key)) {
            // remove CP from selection
            unselectComputePlan(computePlan);
            // remove CP from displayed pinned rows if it isn't also a favorite
            if (!favoriteKeys.includes(computePlan.key)) {
                setFilteredPinnedKeys(
                    filteredPinnedKeys.filter((key) => key !== computePlan.key)
                );
            }
        } else {
            // add CP to selection
            selectComputePlan(computePlan);
            // add CP to displayed pinned rows if it isn't already there (happens if it is also a favorite)
            if (!filteredPinnedKeys.includes(computePlan.key)) {
                setFilteredPinnedKeys([...filteredPinnedKeys, computePlan.key]);
            }
        }
    };

    const onFavoriteChange = (computePlan: ComputePlanT) => () => {
        if (favoriteKeys.includes(computePlan.key)) {
            // remove CP from favorites
            removeFromFavorites(computePlan);
            // remove CP from displayed pinned rows if it isn't also selected
            if (!selectedKeys.includes(computePlan.key)) {
                setFilteredPinnedKeys(
                    filteredPinnedKeys.filter((key) => key !== computePlan.key)
                );
            }
        } else {
            // add CP to favorites
            addToFavorites(computePlan);
            // add CP to displayed pinned rows if it isn't already there (happens if it is also selected)
            if (!filteredPinnedKeys.includes(computePlan.key)) {
                setFilteredPinnedKeys([...filteredPinnedKeys, computePlan.key]);
            }
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

    const { isOpen: isPinnedOpen, onToggle: onPinnedToggle } = useDisclosure();

    const numColumns = 7 + activeHyperparameters.length;

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
                        <SearchBar asset="compute_plan" />
                        {MELLODDY && <FullTextSearchBar />}
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
                                <ClickableTh
                                    minWidth="250px"
                                    onClick={() => onPopoverOpen(0)}
                                    position="sticky"
                                    left="86px"
                                    zIndex="1"
                                    backgroundColor="white"
                                    {...bottomRightBorderProps}
                                >
                                    {MELLODDY ? 'Name' : 'Tag'}
                                </ClickableTh>
                                <ClickableTh
                                    minWidth="255px"
                                    onClick={() => onPopoverOpen(0)}
                                    {...bottomBorderProps}
                                >
                                    Status / Tasks
                                </ClickableTh>
                                <ClickableTh
                                    minWidth="255px"
                                    onClick={() => onPopoverOpen(0)}
                                    {...bottomBorderProps}
                                >
                                    Creation
                                </ClickableTh>
                                <ClickableTh
                                    minWidth="255px"
                                    onClick={() => onPopoverOpen(0)}
                                    {...bottomBorderProps}
                                >
                                    Dates / Duration
                                </ClickableTh>
                                {activeHyperparameters.map((hp) => (
                                    <ClickableTh
                                        key={hp}
                                        minWidth="125px"
                                        onClick={() => onPopoverOpen(0)}
                                        {...bottomBorderProps}
                                    >
                                        {hp}
                                    </ClickableTh>
                                ))}
                            </Tr>
                        </Thead>
                        <ChakraTbody>
                            <Tr>
                                <Td colSpan={numColumns}>
                                    <Button
                                        variant="link"
                                        colorScheme="teal"
                                        size="xs"
                                        leftIcon={
                                            <Icon
                                                as={
                                                    isPinnedOpen
                                                        ? RiArrowDownSLine
                                                        : RiArrowRightSLine
                                                }
                                            />
                                        }
                                        onClick={onPinnedToggle}
                                        marginLeft="2"
                                        position="sticky"
                                        left="8"
                                        zIndex="1"
                                    >
                                        {`Favorites (${filteredPinnedKeys.length})`}
                                    </Button>
                                </Td>
                            </Tr>
                        </ChakraTbody>
                        {isPinnedOpen && (
                            <ChakraTbody>
                                {!refreshFilteredPinnedLoading &&
                                    selectedComputePlans
                                        .filter((computePlan) =>
                                            filteredPinnedKeys.includes(
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
                                                    computePlan
                                                )}
                                                onFavoriteChange={onFavoriteChange(
                                                    computePlan
                                                )}
                                                highlighted={true}
                                                hyperparametersList={
                                                    activeHyperparameters
                                                }
                                            />
                                        ))}
                                {!refreshFilteredPinnedLoading &&
                                    favorites
                                        .filter(
                                            (computePlan) =>
                                                !selectedKeys.includes(
                                                    computePlan.key
                                                ) &&
                                                filteredPinnedKeys.includes(
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
                                                    computePlan
                                                )}
                                                onFavoriteChange={onFavoriteChange(
                                                    computePlan
                                                )}
                                                highlighted={true}
                                                hyperparametersList={
                                                    activeHyperparameters
                                                }
                                            />
                                        ))}
                            </ChakraTbody>
                        )}
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
                                />
                            ) : (
                                computePlans
                                    .filter(
                                        (computePlan) =>
                                            !isFavorite(computePlan) &&
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
                                            isFavorite={isFavorite(computePlan)}
                                            onFavoriteChange={onFavoriteChange(
                                                computePlan
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
