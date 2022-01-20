import AlgoDrawer from './components/AlgoDrawer';
import {
    VStack,
    Thead,
    Tr,
    Th,
    Td,
    Box,
    Text,
    Skeleton,
    HStack,
} from '@chakra-ui/react';

import { listAlgos } from '@/modules/algos/AlgosSlice';
import { getAlgoCategory } from '@/modules/algos/AlgosUtils';
import { getNodeLabel, pseudonymize } from '@/modules/nodes/NodesUtils';

import { formatDate } from '@/libs/utils';

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
    AssetsTable,
    AssetsTableCategoryTh,
    AssetsTablePermissionsTh,
} from '@/components/AssetsTable';
import PermissionTag from '@/components/PermissionTag';
import SearchBar from '@/components/SearchBar';
import { ClickableTr, EmptyTr, TableSkeleton, Tbody } from '@/components/Table';
import {
    AlgoCategoryTableFilterTag,
    OwnerTableFilterTag,
    TableFilterTags,
} from '@/components/TableFilterTags';
import {
    TableFilters,
    OwnerTableFilter,
    AlgoCategoryTableFilter,
} from '@/components/TableFilters';
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
            <AlgoDrawer />
            <VStack marginBottom="2.5" spacing="2.5" alignItems="flex-start">
                <TableTitle title="Algorithms" />
                <HStack spacing="2.5">
                    <TableFilters asset="algo">
                        <OwnerTableFilter />
                        <AlgoCategoryTableFilter />
                    </TableFilters>
                    <SearchBar asset="algo" />
                </HStack>
                <TableFilterTags asset="algo">
                    <AlgoCategoryTableFilterTag />
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
                                <Th>Name / Creation / Owner</Th>
                                <AssetsTableCategoryTh />
                                <AssetsTablePermissionsTh />
                            </Tr>
                        </Thead>
                        <Tbody data-cy={algosLoading ? 'loading' : 'loaded'}>
                            {!algosLoading && algosCount === 0 && (
                                <EmptyTr nbColumns={3} asset="algo" />
                            )}
                            {algosLoading ? (
                                <TableSkeleton
                                    itemCount={algosCount}
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
                                    <Td>
                                        <Skeleton>
                                            <Text fontSize="sm">
                                                Lorem ipsum
                                            </Text>
                                        </Skeleton>
                                    </Td>
                                    <Td textAlign="right">
                                        <Skeleton width="100px" height="20px" />
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
                                        <Td>
                                            <Text fontSize="sm">
                                                {pseudonymize(algo.name)}
                                            </Text>
                                            <Text fontSize="xs">{`Created on ${formatDate(
                                                algo.creation_date
                                            )} by ${getNodeLabel(
                                                algo.owner
                                            )}`}</Text>
                                        </Td>
                                        <Td>
                                            <Text fontSize="sm">
                                                {getAlgoCategory(algo)}
                                            </Text>
                                        </Td>
                                        <Td textAlign="right">
                                            <PermissionTag
                                                permission={
                                                    algo.permissions.process
                                                }
                                            />
                                        </Td>
                                    </ClickableTr>
                                ))
                            )}
                        </Tbody>
                    </AssetsTable>
                </Box>
                <TablePagination currentPage={page} itemCount={algosCount} />
            </VStack>
        </Box>
    );
};

export default Algos;
