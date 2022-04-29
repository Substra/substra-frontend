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
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import useSearchFiltersEffect from '@/hooks/useSearchFiltersEffect';
import { useSyncedStringState } from '@/hooks/useSyncedState';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/hooks/useTableFilters';
import { formatDate } from '@/libs/utils';
import { listDatasets } from '@/modules/datasets/DatasetsSlice';
import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import { compilePath, PATHS } from '@/routes';

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

const Datasets = (): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const {
        params: { page, search: searchFilters, match },
        setLocationWithParams,
    } = useLocationWithParams();
    const [ordering] = useSyncedStringState('ordering', '-creation_date');

    useSearchFiltersEffect(() => {
        return dispatchWithAutoAbort(
            listDatasets({ filters: searchFilters, page, ordering, match })
        );
    }, [searchFilters, page, ordering, match]);

    const datasets: DatasetStubType[] = useAppSelector(
        (state) => state.datasets.datasets
    );
    const datasetsLoading = useAppSelector(
        (state) => state.datasets.datasetsLoading
    );
    const datasetsCount = useAppSelector(
        (state) => state.datasets.datasetsCount
    );

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
            alignItems="flex-start"
        >
            <TableFiltersContext.Provider value={context}>
                <TableTitle title="Datasets" />
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
                        <Tbody data-cy={datasetsLoading ? 'loading' : 'loaded'}>
                            {!datasetsLoading && datasets.length === 0 && (
                                <EmptyTr nbColumns={2} asset="dataset" />
                            )}
                            {datasetsLoading ? (
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
                                    <Td textAlign="right">
                                        <Skeleton width="100px" height="20px" />
                                    </Td>
                                </TableSkeleton>
                            ) : (
                                datasets.map((dataset) => (
                                    <ClickableTr
                                        key={dataset.key}
                                        onClick={() =>
                                            setLocationWithParams(
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
                                        <Td textAlign="right">
                                            <PermissionTag
                                                permission={
                                                    dataset.permissions.process
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
