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
    Flex,
} from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import {
    useCanProcess,
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
import { endOfDay, formatDate } from '@/libs/utils';
import { listFunctions } from '@/modules/functions/FunctionsSlice';
import { compilePath, PATHS } from '@/paths';

import {
    AssetsTable,
    AssetsTablePermissionsTh,
} from '@/components/AssetsTable';
import OrderingTh from '@/components/OrderingTh';
import PermissionTag from '@/components/PermissionTag';
import RefreshButton from '@/components/RefreshButton';
import SearchBar from '@/components/SearchBar';
import { ClickableTr, EmptyTr, TableSkeleton, Tbody } from '@/components/Table';
import {
    DateFilterTag,
    OwnerTableFilterTag,
    PermissionsTableFilterTag,
    TableFilterTags,
} from '@/components/TableFilterTags';
import {
    TableFilters,
    OwnerTableFilter,
    CreationDateTableFilter,
    PermissionsTableFilter,
} from '@/components/TableFilters';
import TablePagination from '@/components/TablePagination';
import TableTitle from '@/components/TableTitle';

import FunctionDrawer from './components/FunctionDrawer';

const Functions = (): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const [page] = usePage();
    const [match] = useMatch();
    const [canProcess] = useCanProcess();
    const [ordering] = useOrdering('-creation_date');
    const [owner] = useOwner();
    const { creationDateAfter, creationDateBefore } = useCreationDate();
    const setLocationPreserveParams = useSetLocationPreserveParams();

    const functions = useAppSelector((state) => state.functions.functions);
    const functionsLoading = useAppSelector((state) => state.functions.functionsLoading);
    const functionsCount = useAppSelector((state) => state.functions.functionsCount);

    useEffect(() => {
        return dispatchWithAutoAbort(
            listFunctions({
                page,
                ordering,
                match,
                owner,
                creation_date_after: creationDateAfter,
                creation_date_before: endOfDay(creationDateBefore),
                can_process: canProcess,
            })
        );
    }, [
        dispatchWithAutoAbort,
        page,
        ordering,
        match,
        owner,
        creationDateAfter,
        creationDateBefore,
        canProcess,
    ]);

    const key = useKeyFromPath(PATHS.FUNCTION);

    const context = useTableFiltersContext('function');
    const { onPopoverOpen } = context;

    useAssetListDocumentTitleEffect('Functionrithms list', key);

    return (
        <VStack
            marginX="auto"
            paddingY="8"
            paddingX="6"
            spacing="2.5"
            alignItems="stretch"
        >
            <FunctionDrawer />
            <TableFiltersContext.Provider value={context}>
                <TableTitle title="Functionrithms" />
                <Flex justifyContent="space-between">
                    <HStack spacing="2.5">
                        <TableFilters>
                            <OwnerTableFilter />
                            <CreationDateTableFilter />
                            <PermissionsTableFilter />
                        </TableFilters>
                        <SearchBar />
                    </HStack>
                    <RefreshButton
                        loading={functionsLoading}
                        dispatchWithAutoAbort={dispatchWithAutoAbort}
                        actionBuilder={() =>
                            listFunctions({
                                page,
                                ordering,
                                match,
                                owner,
                                creation_date_after: creationDateAfter,
                                creation_date_before:
                                    endOfDay(creationDateBefore),
                                can_process: canProcess,
                            })
                        }
                    />
                </Flex>
                <TableFilterTags>
                    <OwnerTableFilterTag />
                    <DateFilterTag
                        urlParam="creation_date"
                        label="Creation date"
                    />
                    <PermissionsTableFilterTag />
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
                        <Tbody data-cy={functionsLoading ? 'loading' : 'loaded'}>
                            {!functionsLoading && functionsCount === 0 && (
                                <EmptyTr nbColumns={2} asset="function" />
                            )}
                            {functionsLoading ? (
                                <TableSkeleton
                                    itemCount={functionsCount}
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
                                functions.map((function) => (
                                    <ClickableTr
                                        key={function.key}
                                        onClick={() =>
                                            setLocationPreserveParams(
                                                compilePath(PATHS.FUNCTION, {
                                                    key: function.key,
                                                })
                                            )
                                        }
                                    >
                                        <Td>
                                            <Text fontSize="sm">
                                                {function.name}
                                            </Text>
                                            <Text fontSize="xs">{`Created on ${formatDate(
                                                function.creation_date
                                            )} by ${function.owner}`}</Text>
                                        </Td>
                                        <Td textAlign="right">
                                            <PermissionTag
                                                permission={
                                                    function.permissions.process
                                                }
                                            />
                                        </Td>
                                    </ClickableTr>
                                ))
                            )}
                        </Tbody>
                    </AssetsTable>
                </Box>
                <TablePagination currentPage={page} itemCount={functionsCount} />
            </TableFiltersContext.Provider>
        </VStack>
    );
};

export default Functions;
