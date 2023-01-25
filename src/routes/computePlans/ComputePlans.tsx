import { useEffect, useMemo, useState } from 'react';

import { VStack, Table, Box, HStack, Flex, Button } from '@chakra-ui/react';
import { RiDownloadLine } from 'react-icons/ri';

import { exportPerformances } from '@/api/ComputePlansApi';
import { downloadBlob } from '@/api/request';
import CustomColumnsModal from '@/features/customColumns/CustomColumnsModal';
import useCustomColumns from '@/features/customColumns/useCustomColumns';
import useMetadataStore from '@/features/metadata/useMetadataStore';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import { useLocalStorageKeyArrayState } from '@/hooks/useLocalStorageState';
import {
    useCreationDate,
    useCreator,
    useDuration,
    useEndDate,
    useFavoritesOnly,
    useMatch,
    useMetadataString,
    useOrdering,
    usePage,
    useStartDate,
    useStatus,
} from '@/hooks/useSyncedState';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/hooks/useTableFilters';
import { endOfDay } from '@/libs/utils';
import { ComputePlanT } from '@/types/ComputePlansTypes';

import BulkSelection from '@/components/BulkSelection';
import RefreshButton from '@/components/RefreshButton';
import SearchBar from '@/components/SearchBar';
import { EmptyTr, Tbody } from '@/components/Table';
import {
    CreatorTableFilterTag,
    DateFilterTag,
    DurationFilterTag,
    FavoritesTableFilterTag,
    MetadataFilterTag,
    StatusTableFilterTag,
    TableFilterTags,
} from '@/components/TableFilterTags';
import {
    TableFilters,
    ComputePlanStatusTableFilter,
    ComputePlanFavoritesTableFilter,
    CreationDateTableFilter,
    DurationTableFilter,
    StartDateTableFilter,
    EndDateTableFilter,
    MetadataTableFilter,
} from '@/components/TableFilters';
import CreatorTableFilter from '@/components/TableFilters/CreatorTableFilter';
import TablePagination from '@/components/TablePagination';

import ComputePlanTHead from './components/ComputePlanTHead';
import ComputePlanTr from './components/ComputePlanTr';
import ComputePlanTrSkeleton from './components/ComputePlanTrSkeleton';
import useComputePlansStore from './useComputePlansStore';

const ComputePlans = (): JSX.Element => {
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-creation_date');
    const [status] = useStatus();
    const [favoritesOnly] = useFavoritesOnly();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const { durationMin, durationMax } = useDuration();
    const [metadataFilter] = useMetadataString();
    const [creator] = useCreator();

    const {
        computePlans,
        fetchingComputePlans,
        computePlansCount,
        fetchComputePlans,
    } = useComputePlansStore();

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
    const isFavoritesOnlyAndHasNoResults =
        favoritesOnly && favorites.length === 0;

    const key = useMemo(() => {
        return favoritesOnly ? favorites : null;
    }, [favoritesOnly, favorites]);

    const filters = useMemo(
        () => ({
            match,
            status,
            key,
            creation_date_after: creationDateAfter,
            creation_date_before: endOfDay(creationDateBefore),
            start_date_after: startDateAfter,
            start_date_before: endOfDay(startDateBefore),
            end_date_after: endDateAfter,
            end_date_before: endOfDay(endDateBefore),
            metadata: metadataFilter,
            duration_min: durationMin,
            duration_max: durationMax,
            creator: creator,
        }),
        [
            match,
            status,
            key,
            creationDateAfter,
            creationDateBefore,
            startDateAfter,
            startDateBefore,
            endDateAfter,
            endDateBefore,
            metadataFilter,
            durationMin,
            durationMax,
            creator,
        ]
    );

    useEffect(() => {
        fetchComputePlans({ page, ordering, ...filters });
    }, [fetchComputePlans, page, ordering, filters]);

    const { metadata } = useMetadataStore();

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle('Compute plans list'),
        []
    );

    const { columns, setColumns } = useCustomColumns();

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
            metadata_columns: metadata.join(),
            ...filters,
        });
        downloadBlob(
            response.data,
            Object.values(filters).filter((f) =>
                Array.isArray(f) ? f.length > 0 : !!f
            ).length
                ? 'filtered_performances.csv'
                : 'all_performances.csv'
        );
        setDownloading(false);
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
                            <CreatorTableFilter />
                            <CreationDateTableFilter />
                            <StartDateTableFilter />
                            <EndDateTableFilter />
                            <DurationTableFilter />
                            <MetadataTableFilter />
                        </TableFilters>
                        <SearchBar placeholder="Search name or key..." />
                    </HStack>
                    <HStack spacing="2.5">
                        <RefreshButton
                            loading={fetchingComputePlans}
                            list={() =>
                                fetchComputePlans({
                                    page: page,
                                    ordering: ordering,
                                    ...filters,
                                })
                            }
                        />
                        <CustomColumnsModal
                            columns={columns}
                            setColumns={setColumns}
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
                        <CreatorTableFilterTag />
                        <DateFilterTag
                            urlParam="creation_date"
                            label="Creation date"
                        />
                        <DateFilterTag
                            urlParam="start_date"
                            label="Start date"
                        />
                        <DateFilterTag urlParam="end_date" label="End date" />
                        <MetadataFilterTag />
                        <DurationFilterTag />
                    </TableFilterTags>
                </Box>
                <Box flexGrow={1} overflow="auto">
                    <Table size="md">
                        <ComputePlanTHead
                            onPopoverOpen={onPopoverOpen}
                            columns={columns}
                        />
                        <Tbody
                            data-cy={
                                fetchingComputePlans ? 'loading' : 'loaded'
                            }
                        >
                            {!fetchingComputePlans &&
                                (computePlans.length === 0 ||
                                    isFavoritesOnlyAndHasNoResults) && (
                                    <EmptyTr
                                        nbColumns={3 + columns.length}
                                        asset="compute_plan"
                                    />
                                )}
                            {fetchingComputePlans && (
                                <ComputePlanTrSkeleton
                                    computePlansCount={computePlansCount}
                                    page={page}
                                    columns={columns}
                                />
                            )}
                            {!fetchingComputePlans &&
                                !isFavoritesOnlyAndHasNoResults &&
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
                                        columns={columns}
                                    />
                                ))}
                        </Tbody>
                    </Table>
                </Box>
                <Box paddingX="6">
                    <TablePagination
                        currentPage={page}
                        itemCount={
                            isFavoritesOnlyAndHasNoResults
                                ? 0
                                : computePlansCount
                        }
                    />
                </Box>
                {selectedComputePlans.length > 0 && (
                    <Box
                        paddingX="4"
                        paddingY="3"
                        backgroundColor="primary.500"
                    >
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
