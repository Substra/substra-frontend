import AlgoSider from './components/AlgoSider';
import { VStack, Table, Thead, Tr, Th, Tbody, Td, Box } from '@chakra-ui/react';

import { listAlgos } from '@/modules/algos/AlgosSlice';
import { getAlgoCategory } from '@/modules/algos/AlgosUtils';

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

const Algos = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();

    const algos = useAppSelector((state) => state.algos.algos);
    const algosLoading = useAppSelector((state) => state.algos.algosLoading);
    const algosCount = useAppSelector((state) => state.algos.algosCount);

    useSearchFiltersEffect(() => {
        dispatch(listAlgos({ filters: searchFilters, page }));
    }, [searchFilters, page]);

    const key = useKeyFromPath(PATHS.ALGO);

    useAssetListDocumentTitleEffect('Algorithms list', key);

    return (
        <Box marginLeft="auto" marginRight="auto" padding="6">
            <AlgoSider />
            <VStack marginBottom="2.5" spacing="2.5" alignItems="flex-start">
                <TableTitle title="Algorithms" />
                <SearchBar asset="algo" />
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
                                <Th>Category</Th>
                                <Th>Name</Th>
                                <Th>
                                    Owner
                                    <OwnerTableFilter
                                        assets={[
                                            'algo',
                                            'composite_algo',
                                            'aggregate_algo',
                                        ]}
                                    />
                                </Th>
                                <Th>Permissions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {!algosLoading && algosCount === 0 && (
                                <EmptyTr nbColumns={5} />
                            )}
                            {algosLoading ? (
                                <TableSkeleton
                                    itemCount={algosCount}
                                    currentPage={page}
                                >
                                    <CreationDateSkeletonTd />
                                    <Td>
                                        <Skeleton width={80} height={12} />
                                    </Td>
                                    <Td>
                                        <Skeleton width={500} height={12} />
                                    </Td>
                                    <Td>
                                        <Skeleton width={80} height={12} />
                                    </Td>
                                    <Td>
                                        <Skeleton width={150} height={12} />
                                    </Td>
                                </TableSkeleton>
                            ) : (
                                algos.map((algo) => (
                                    <ClickableTr
                                        key={algo.key}
                                        onClick={() =>
                                            setLocationWithParams(
                                                compilePath(PATHS.ALGO, {
                                                    key: algo.key,
                                                })
                                            )
                                        }
                                    >
                                        <CreationDateTd
                                            creationDate={algo.creation_date}
                                        />
                                        <Td>{getAlgoCategory(algo)}</Td>
                                        <Td>{algo.name}</Td>
                                        <Td>{algo.owner}</Td>
                                        <Td>
                                            <PermissionCellContent
                                                permissions={algo.permissions}
                                            />
                                        </Td>
                                    </ClickableTr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Box>
                <TablePagination currentPage={page} itemCount={algosCount} />
            </VStack>
        </Box>
    );
};

export default Algos;
