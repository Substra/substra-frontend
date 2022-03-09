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

import { useAppSelector, useSearchFiltersEffect } from '@/hooks';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import useHyperparameters from '@/hooks/useHyperparameters';
import useLocalStorageItems from '@/hooks/useLocalStorageItems';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/hooks/useTableFilters';
import useWithAbortController from '@/hooks/useWithAbortController';
import { retrieveComputePlan } from '@/modules/computePlans/ComputePlansApi';
import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { compilePath, PATHS } from '@/routes';

import { ClickableTh } from '@/components/AssetsTable';
import SearchBar from '@/components/SearchBar';
import { EmptyTr, Tbody } from '@/components/Table';
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
        params: { page, search: searchFilters },
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
        onFavoriteChange,
        updateFavorite,
        removeFromFavorites,
    } = useFavoriteComputePlans();
    const withAbortController = useWithAbortController();

    const selectedKeys = selectedComputePlans.map((cp) => cp.key);

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
                retrieveComputePlan(computePlan.key, {
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

        const abortRefreshFavorites = withAbortController(
            refreshSelectedAndFavorites
        );
        const abortListComputePlans = dispatchWithAutoAbort(
            listComputePlans({ filters: searchFilters, page })
        );
        return () => {
            abortRefreshFavorites();
            abortListComputePlans();
        };
    }, [searchFilters, page]);

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

    const hyperparametersList = useHyperparameters();

    const onSelectionChange = (computePlan: ComputePlanT) => () => {
        if (selectedKeys.includes(computePlan.key)) {
            unselectComputePlan(computePlan);
        } else {
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
                        <SearchBar asset="compute_plan" />
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
                            zIndex={1}
                        >
                            <Tr>
                                <Th padding="0" minWidth="50px"></Th>
                                <Th padding="0" minWidth="36px"></Th>
                                <ClickableTh
                                    minWidth="250px"
                                    onClick={() => onPopoverOpen(0)}
                                >
                                    {MELLODDY ? 'Name' : 'Tag'}
                                </ClickableTh>
                                <ClickableTh
                                    minWidth="255px"
                                    onClick={() => onPopoverOpen(0)}
                                >
                                    Status / Tasks
                                </ClickableTh>
                                <ClickableTh
                                    minWidth="255px"
                                    onClick={() => onPopoverOpen(0)}
                                >
                                    Creation
                                </ClickableTh>
                                <ClickableTh
                                    minWidth="255px"
                                    onClick={() => onPopoverOpen(0)}
                                >
                                    Dates / Duration
                                </ClickableTh>
                                {hyperparametersList.map((hp) => (
                                    <ClickableTh
                                        key={hp}
                                        minWidth="125px"
                                        onClick={() => onPopoverOpen(0)}
                                    >
                                        {hp}
                                    </ClickableTh>
                                ))}
                            </Tr>
                        </Thead>
                        <ChakraTbody>
                            {selectedComputePlans.map((computePlan) => (
                                <ComputePlanTr
                                    key={computePlan.key}
                                    computePlan={computePlan}
                                    selectedKeys={selectedKeys}
                                    onSelectionChange={onSelectionChange}
                                    isFavorite={isFavorite}
                                    onFavoriteChange={onFavoriteChange}
                                    highlighted={true}
                                    hyperparametersList={hyperparametersList}
                                />
                            ))}
                        </ChakraTbody>
                        <ChakraTbody>
                            {favorites
                                .filter(
                                    (computePlan) =>
                                        !selectedKeys.includes(computePlan.key)
                                )
                                .map((computePlan) => (
                                    <ComputePlanTr
                                        key={computePlan.key}
                                        computePlan={computePlan}
                                        selectedKeys={selectedKeys}
                                        onSelectionChange={onSelectionChange}
                                        isFavorite={isFavorite}
                                        onFavoriteChange={onFavoriteChange}
                                        highlighted={true}
                                        hyperparametersList={
                                            hyperparametersList
                                        }
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
                                            selectedKeys={selectedKeys}
                                            onSelectionChange={
                                                onSelectionChange
                                            }
                                            isFavorite={isFavorite}
                                            onFavoriteChange={onFavoriteChange}
                                            highlighted={false}
                                            hyperparametersList={
                                                hyperparametersList
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
