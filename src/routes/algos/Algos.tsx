import { useEffect } from 'react';

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
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import {
    useCategory,
    useCreationDate,
    useMatch,
    useOrdering,
    useOwner,
    usePage,
} from '@/hooks/useSyncedState';
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
    DateFilterTag,
    OwnerTableFilterTag,
    TableFilterTags,
} from '@/components/TableFilterTags';
import {
    TableFilters,
    OwnerTableFilter,
    AlgoCategoryTableFilter,
    CreationDateTableFilter,
} from '@/components/TableFilters';
import TablePagination from '@/components/TablePagination';
import TableTitle from '@/components/TableTitle';

import AlgoDrawer from './components/AlgoDrawer';

const Algos = (): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-creation_date');
    const [owner] = useOwner();
    const [category] = useCategory();
    const { creationDateAfter, creationDateBefore } = useCreationDate();
    const setLocationPreserveParams = useSetLocationPreserveParams();

    const algos = useAppSelector((state) => state.algos.algos);
    const algosLoading = useAppSelector((state) => state.algos.algosLoading);
    const algosCount = useAppSelector((state) => state.algos.algosCount);

    useEffect(() => {
        return dispatchWithAutoAbort(
            listAlgos({
                page,
                ordering,
                match,
                owner,
                category,
                creation_date_after: creationDateAfter,
                creation_date_before: creationDateBefore,
            })
        );
    }, [
        dispatchWithAutoAbort,
        page,
        ordering,
        match,
        owner,
        category,
        creationDateAfter,
        creationDateBefore,
    ]);

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
                        <CreationDateTableFilter />
                    </TableFilters>
                    <SearchBar />
                </HStack>
                <TableFilterTags>
                    <AlgoCategoryTableFilterTag />
                    <OwnerTableFilterTag />
                    <DateFilterTag
                        urlParam="creation_date_before"
                        label="Max creation date"
                    />
                    <DateFilterTag
                        urlParam="creation_date_after"
                        label="Min creation date"
                    />
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
                                <OrderingTh
                                    openFilters={() => onPopoverOpen(1)}
                                    options={[
                                        {
                                            label: 'Category',
                                            asc: {
                                                label: 'Sort category Composite -> Aggregate -> Simple',
                                                value: '-category',
                                            },
                                            desc: {
                                                label: 'Sort category Simple -> Aggregate -> Composite',
                                                value: 'category',
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
                                            setLocationPreserveParams(
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
