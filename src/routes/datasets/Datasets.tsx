import DatasetSider from './components/DatasetSider';
import { VStack, Table, Thead, Tr, Th, Tbody, Td, Box } from '@chakra-ui/react';

import { listDatasets } from '@/modules/datasets/DatasetsSlice';
import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import {
    CreationDateSkeletonTd,
    CreationDateTd,
} from '@/components/CreationDateTableCells';
import { OwnerTableFilter } from '@/components/NodeTableFilters';
import PermissionCellContent from '@/components/PermissionCellContent';
import SearchBar from '@/components/SearchBar';
import Skeleton from '@/components/Skeleton';
import { ClickableTr, EmptyTr, TableSkeleton } from '@/components/Table';
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
    const key = useKeyFromPath(PATHS.DATASET);

    useAssetListDocumentTitleEffect('Datasets list', key);

    return (
        <Box padding="6" marginLeft="auto" marginRight="auto">
            <DatasetSider />
            <VStack marginBottom="2.5" spacing="2.5" alignItems="flex-start">
                <TableTitle title="Datasets" />
                <SearchBar asset="dataset" />
                <Box
                    backgroundColor="white"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="gray.100"
                >
                    <Table size="sm">
                        <Thead>
                            <Tr>
                                <Th>Creation date</Th>
                                <Th>Name</Th>
                                <Th>
                                    Owner
                                    <OwnerTableFilter assets={['dataset']} />
                                </Th>
                                <Th>Permissions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {!datasetsLoading && datasets.length === 0 && (
                                <EmptyTr nbColumns={4} />
                            )}
                            {datasetsLoading ? (
                                <TableSkeleton
                                    itemCount={datasetsCount}
                                    currentPage={page}
                                >
                                    <CreationDateSkeletonTd />
                                    <Td>
                                        <Skeleton width={500} height={12} />
                                    </Td>
                                    <Td>
                                        <Skeleton width={80} height={12} />
                                    </Td>
                                    <Td>
                                        <Skeleton width={120} height={12} />
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
                                        <CreationDateTd
                                            creationDate={dataset.creation_date}
                                        />
                                        <Td>{dataset.name}</Td>
                                        <Td>{dataset.owner}</Td>
                                        <Td>
                                            <PermissionCellContent
                                                permissions={
                                                    dataset.permissions
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
