import {
    VStack,
    Thead,
    Tr,
    Td,
    Box,
    Text,
    Skeleton,
    HStack,
} from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import useSearchFiltersEffect from '@/hooks/useSearchFiltersEffect';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/hooks/useTableFilters';
import { formatDate } from '@/libs/utils';
import { listAlgos } from '@/modules/algos/AlgosSlice';
import { getAlgoCategory } from '@/modules/algos/AlgosUtils';
import { compilePath, PATHS } from '@/routes';

import {
    AssetsTable,
    AssetsTableCategoryTh,
    AssetsTablePermissionsTh,
    ClickableTh,
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

import AlgoDrawer from './components/AlgoDrawer';

const Algos = (): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();

    const algos = useAppSelector((state) => state.algos.algos);
    const algosLoading = useAppSelector((state) => state.algos.algosLoading);
    const algosCount = useAppSelector((state) => state.algos.algosCount);

    useSearchFiltersEffect(() => {
        return dispatchWithAutoAbort(
            listAlgos({ filters: searchFilters, page })
        );
    }, [searchFilters, page]);

    const key = useKeyFromPath(PATHS.ALGO);

    const context = useTableFiltersContext('algo');
    const { onPopoverOpen } = context;

    useAssetListDocumentTitleEffect('Algorithms list', key);

    return (
        <VStack
            marginX="auto"
            paddingY="8"
            paddingX="6"
            spacing="2.5"
            alignItems="flex-start"
        >
            <AlgoDrawer />
            <TableFiltersContext.Provider value={context}>
                <TableTitle title="Algorithms" />
                <HStack spacing="2.5">
                    <TableFilters>
                        <OwnerTableFilter />
                        <AlgoCategoryTableFilter />
                    </TableFilters>
                    <SearchBar asset="algo" />
                </HStack>
                <TableFilterTags>
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
                                <ClickableTh onClick={() => onPopoverOpen(0)}>
                                    Name / Creation / Owner
                                </ClickableTh>
                                <AssetsTableCategoryTh
                                    onClick={() => onPopoverOpen(1)}
                                />
                                <AssetsTablePermissionsTh
                                    onClick={() => onPopoverOpen(0)}
                                />
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
                                                {algo.name}
                                            </Text>
                                            <Text fontSize="xs">{`Created on ${formatDate(
                                                algo.creation_date
                                            )} by ${algo.owner}`}</Text>
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
            </TableFiltersContext.Provider>
        </VStack>
    );
};

export default Algos;
