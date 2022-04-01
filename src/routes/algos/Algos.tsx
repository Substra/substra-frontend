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
import { useSyncedStringState } from '@/hooks/useSyncedState';
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
    AssetsTablePermissionsTh,
} from '@/components/AssetsTable';
import OrderingTh from '@/components/OrderingTh';
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
    const [ordering] = useSyncedStringState('ordering', '-creation_date');

    const algos = useAppSelector((state) => state.algos.algos);
    const algosLoading = useAppSelector((state) => state.algos.algosLoading);
    const algosCount = useAppSelector((state) => state.algos.algosCount);

    useSearchFiltersEffect(() => {
        return dispatchWithAutoAbort(
            listAlgos({ filters: searchFilters, page, ordering })
        );
    }, [searchFilters, page, ordering]);

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
                                <OrderingTh
                                    openFilters={() => onPopoverOpen(0)}
                                    options={[
                                        {
                                            label: 'Name',
                                            asc: {
                                                label: 'Sort name A -> Z',
                                                value: 'name',
                                            },
                                            desc: {
                                                label: 'Sort name Z -> A',
                                                value: '-name',
                                            },
                                        },
                                        {
                                            label: 'Creation',
                                            asc: {
                                                label: 'Sort creation newest first',
                                                value: 'creation_date',
                                            },
                                            desc: {
                                                label: 'Sort creation oldest first',
                                                value: '-creation_date',
                                            },
                                        },
                                        {
                                            label: 'Owner',
                                            asc: {
                                                label: 'Sort owner A -> Z',
                                                value: 'owner',
                                            },
                                            desc: {
                                                label: 'Sort owner Z -> A',
                                                value: '-owner',
                                            },
                                        },
                                    ]}
                                />
                                <OrderingTh
                                    openFilters={() => onPopoverOpen(1)}
                                    options={[
                                        {
                                            label: 'Category',
                                            asc: {
                                                label: 'Sort category A -> Z',
                                                value: 'category',
                                            },
                                            desc: {
                                                label: 'Sort category Z -> A',
                                                value: '-category',
                                            },
                                        },
                                    ]}
                                    width="140px"
                                />
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
