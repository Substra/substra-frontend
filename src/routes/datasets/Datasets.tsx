import {
    VStack,
    HStack,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Box,
    Text,
    Skeleton,
} from '@chakra-ui/react';

import { listDatasets } from '@/modules/datasets/DatasetsSlice';
import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';

import { formatDate } from '@/libs/utils';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import PermissionTag from '@/components/PermissionTag';
import SearchBar from '@/components/SearchBar';
import { ClickableTr, EmptyTr, TableSkeleton } from '@/components/Table';
import {
    OwnerTableFilterTag,
    TableFilterTags,
} from '@/components/TableFilterTags';
import { OwnerTableFilter, TableFilters } from '@/components/TableFilters';
import TablePagination from '@/components/TablePagination';
import TableTitle from '@/components/TableTitle';

const Datasets = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        params: { page, search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    useSearchFiltersEffect(() => {
        dispatch(listDatasets({ filters: searchFilters, page }));
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

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle('Datasets list'),
        []
    );

    return (
        <Box padding="6" marginLeft="auto" marginRight="auto">
            <VStack marginBottom="2.5" spacing="2.5" alignItems="flex-start">
                <TableTitle title="Datasets" />
                <HStack spacing="2.5">
                    <TableFilters asset="dataset">
                        <OwnerTableFilter />
                    </TableFilters>
                    <SearchBar asset="dataset" />
                </HStack>
                <TableFilterTags asset="dataset">
                    <OwnerTableFilterTag />
                </TableFilterTags>
                <Box
                    backgroundColor="white"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="gray.100"
                >
                    <Table size="md" minWidth="870px">
                        <Thead>
                            <Tr>
                                <Th>Name / Creation / Owner</Th>
                                <Th
                                    textAlign="right"
                                    width="1px"
                                    whiteSpace="nowrap"
                                >
                                    Processable by
                                </Th>
                                <Th
                                    textAlign="right"
                                    width="1px"
                                    whiteSpace="nowrap"
                                >
                                    Downloadable by
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody data-cy={datasetsLoading ? 'loading' : 'loaded'}>
                            {!datasetsLoading && datasets.length === 0 && (
                                <EmptyTr nbColumns={3} />
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
                                        <Td textAlign="right">
                                            <PermissionTag
                                                permission={
                                                    dataset.permissions.download
                                                }
                                            />
                                        </Td>
                                    </ClickableTr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Box>
                <TablePagination currentPage={page} itemCount={datasetsCount} />
            </VStack>
        </Box>
    );
};

export default Datasets;
