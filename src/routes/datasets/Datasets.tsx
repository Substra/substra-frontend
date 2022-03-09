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

import { useAppSelector, useSearchFiltersEffect } from '@/hooks';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useLocationWithParams from '@/hooks/useLocationWithParams';
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
    ClickableTh,
} from '@/components/AssetsTable';
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
        params: { page, search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    useSearchFiltersEffect(() => {
        return dispatchWithAutoAbort(
            listDatasets({ filters: searchFilters, page })
        );
    }, [searchFilters, page]);

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
                    <SearchBar asset="dataset" />
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
                                <ClickableTh onClick={() => onPopoverOpen(0)}>
                                    Name / Creation / Owner
                                </ClickableTh>
                                <AssetsTablePermissionsTh
                                    onClick={() => onPopoverOpen(0)}
                                />
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
