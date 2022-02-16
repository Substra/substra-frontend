import { useEffect, useRef, useState } from 'react';

import ComputePlanTr from './components/ComputePlanTr';
import ComputePlanTrSkeleton from './components/ComputePlanTrSkeleton';
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
import { RiAddLine } from 'react-icons/ri';
import { useLocation } from 'wouter';

import { retrieveComputePlan } from '@/modules/computePlans/ComputePlansApi';
import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useLocalStorageItems from '@/hooks/useLocalStorageItems';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/hooks/useTableFilters';

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

declare const MELLODDY: boolean;

const ComputePlans = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        params: { page, search: searchFilters },
    } = useLocationWithParams();
    const [, setLocation] = useLocation();
    /** FIXME:
     * the computePlanDetails and computePlanDetailsLoading are a temporary change,
     * they are here to compensate for a perf issue of the backend.
     *
     * As a result, /compute_plan doesn't return task counts or statuses anymore,
     * it's only included in /compute_plan/<key>
     *
     * We therefore have to fetch each CP independently once the list is loaded
     * to have access to all data.
     */
    const [computePlansDetails, setComputePlansDetails] = useState<
        Record<string, ComputePlanT | undefined>
    >({});
    const [computePlansDetailsLoading, setComputePlansDetailsLoading] =
        useState<Record<string, boolean>>({});

    useSearchFiltersEffect(() => {
        const promise = dispatch(
            listComputePlans({ filters: searchFilters, page })
        );
        return () => {
            promise.abort();
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

    const {
        items: selectedComputePlans,
        addItem: selectComputePlan,
        removeItem: unselectComputePlan,
        clearItems: resetSelection,
    } = useLocalStorageItems<ComputePlanT>('selected_compute_plans');
    const selectedKeys = selectedComputePlans.map((cp) => cp.key);

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

    const {
        items: pinnedItems,
        addItem: pinItem,
        removeItem: unpinItem,
    } = useLocalStorageItems<ComputePlanT>('pinned_compute_plans');
    const pinnedKeys = pinnedItems.map((cp) => cp.key);

    const onPinChange = (computePlan: ComputePlanT) => () => {
        if (pinnedKeys.includes(computePlan.key)) {
            unpinItem(computePlan);
        } else {
            pinItem(computePlan);
        }
    };

    const initComputePlansDetails = (computePlanKeys: string[]) => {
        const details: Record<string, undefined> = {};
        const detailsLoading: Record<string, true> = {};
        for (const computePlanKey of computePlanKeys) {
            if (!computePlansDetails[computePlanKey]) {
                details[computePlanKey] = undefined;
                detailsLoading[computePlanKey] = true;
            }
        }
        setComputePlansDetails((computePlanDetails) => ({
            ...computePlanDetails,
            ...details,
        }));
        setComputePlansDetailsLoading((computePlansDetailsLoading) => ({
            ...computePlansDetailsLoading,
            ...detailsLoading,
        }));
    };

    const retrieveComputePlansDetails = async (
        computePlanKeys: string[],
        abortController: AbortController
    ) => {
        // retrieve details one after the other (not in parallel)
        for (const computePlanKey of computePlanKeys) {
            // do not refetch already available details
            if (computePlansDetails[computePlanKey]) {
                continue;
            }
            // retrieve
            const response = await retrieveComputePlan(computePlanKey, {
                signal: abortController.signal,
            });
            const computePlan: ComputePlanT = response.data;
            // save details
            setComputePlansDetails((computePlansDetails) => ({
                ...computePlansDetails,
                [computePlanKey]: computePlan,
            }));
            setComputePlansDetailsLoading((computePlansDetailsLoading) => ({
                ...computePlansDetailsLoading,
                [computePlanKey]: false,
            }));
        }
    };

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const computePlanKeys = [
            ...selectedKeys,
            ...pinnedKeys.filter((key) => !selectedKeys.includes(key)),
            ...computePlans
                .map((cp) => cp.key)
                .filter(
                    (key) =>
                        !selectedKeys.includes(key) && !pinnedKeys.includes(key)
                ),
        ];

        initComputePlansDetails(computePlanKeys);
        retrieveComputePlansDetails(
            computePlanKeys,
            abortControllerRef.current
        );

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [computePlans]);

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
                        {/**
                         * FIXME:
                         * Filters are broken in the backend (no status available in localrep for now),
                         * so we disable the UI components for now.
                         * */}
                        {MELLODDY ? (
                            <Button
                                size="sm"
                                backgroundColor="secondary"
                                leftIcon={<RiAddLine />}
                                isDisabled={true}
                            >
                                Add Filter
                            </Button>
                        ) : (
                            <TableFilters>
                                <ComputePlanStatusTableFilter />
                            </TableFilters>
                        )}
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
                                {MELLODDY ? (
                                    <>
                                        <Th minWidth="250px">
                                            {MELLODDY ? 'Name' : 'Tag'}
                                        </Th>
                                        <Th minWidth="255px">Status / Tasks</Th>
                                        <Th minWidth="255px">Creation</Th>
                                        <Th minWidth="255px">
                                            Dates / Duration
                                        </Th>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </Tr>
                        </Thead>
                        <ChakraTbody>
                            {selectedComputePlans.map((computePlan) => (
                                <ComputePlanTr
                                    key={computePlan.key}
                                    computePlan={computePlan}
                                    computePlanDetails={
                                        computePlansDetails[computePlan.key]
                                    }
                                    computePlanDetailsLoading={
                                        computePlansDetailsLoading[
                                            computePlan.key
                                        ]
                                    }
                                    selectedKeys={selectedKeys}
                                    onSelectionChange={onSelectionChange}
                                    pinnedKeys={pinnedKeys}
                                    onPinChange={onPinChange}
                                    highlighted={true}
                                />
                            ))}
                        </ChakraTbody>
                        <ChakraTbody>
                            {pinnedItems
                                .filter(
                                    (computePlan) =>
                                        !selectedKeys.includes(computePlan.key)
                                )
                                .map((computePlan) => (
                                    <ComputePlanTr
                                        key={computePlan.key}
                                        computePlan={computePlan}
                                        computePlanDetails={
                                            computePlansDetails[computePlan.key]
                                        }
                                        computePlanDetailsLoading={
                                            computePlansDetailsLoading[
                                                computePlan.key
                                            ]
                                        }
                                        selectedKeys={selectedKeys}
                                        onSelectionChange={onSelectionChange}
                                        pinnedKeys={pinnedKeys}
                                        onPinChange={onPinChange}
                                        highlighted={true}
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
                                            !pinnedKeys.includes(
                                                computePlan.key
                                            ) &&
                                            !selectedKeys.includes(
                                                computePlan.key
                                            )
                                    )
                                    .map((computePlan) => (
                                        <ComputePlanTr
                                            key={computePlan.key}
                                            computePlan={computePlan}
                                            computePlanDetails={
                                                computePlansDetails[
                                                    computePlan.key
                                                ]
                                            }
                                            computePlanDetailsLoading={
                                                computePlansDetailsLoading[
                                                    computePlan.key
                                                ]
                                            }
                                            selectedKeys={selectedKeys}
                                            onSelectionChange={
                                                onSelectionChange
                                            }
                                            pinnedKeys={pinnedKeys}
                                            onPinChange={onPinChange}
                                            highlighted={false}
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
