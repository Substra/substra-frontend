import { useEffect } from 'react';

import { useParams } from 'wouter';

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

import {
    TableFilters,
    OwnerTableFilter,
    CreationDateTableFilter,
    PermissionsTableFilter,
} from '@/features/tableFilters';
import {
    DateFilterTag,
    OwnerTableFilterTag,
    PermissionsTableFilterTag,
    TableFilterTags,
} from '@/features/tableFilters/TableFilterTags';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/features/tableFilters/useTableFilters';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useHasPermission from '@/hooks/useHasPermission';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import {
    useCanProcess,
    useCreationDate,
    useMatch,
    useOrdering,
    useOwner,
    usePage,
} from '@/hooks/useSyncedState';
import { endOfDay, formatDate } from '@/libs/utils';
import { compilePath, PATHS } from '@/paths';

import PermissionTag from '@/components/PermissionTag';
import RefreshButton from '@/components/RefreshButton';
import SearchBar from '@/components/SearchBar';
import {
    AssetsTable,
    AssetsTablePermissionsTh,
} from '@/components/table/AssetsTable';
import OrderingTh from '@/components/table/OrderingTh';
import {
    ClickableTr,
    EmptyTr,
    TableSkeleton,
    Tbody,
} from '@/components/table/Table';
import TablePagination from '@/components/table/TablePagination';
import TableTitle from '@/components/table/TableTitle';

import FunctionDrawer from './components/FunctionDrawer';
import useFunctionsStore from './useFunctionsStore';

const Functions = (): JSX.Element => {
    const [page] = usePage();
    const [match] = useMatch();
    const [canProcess] = useCanProcess();
    const [ordering] = useOrdering('-creation_date');
    const [owner] = useOwner();
    const { creationDateAfter, creationDateBefore } = useCreationDate();
    const setLocationPreserveParams = useSetLocationPreserveParams();

    const { functions, functionsCount, fetchingFunctions, fetchFunctions } =
        useFunctionsStore();

    useEffect(() => {
        const abort = fetchFunctions({
            page,
            ordering,
            match,
            owner,
            creation_date_after: creationDateAfter,
            creation_date_before: endOfDay(creationDateBefore),
            can_process: canProcess,
        });
        return abort;
    }, [
        fetchFunctions,
        page,
        ordering,
        match,
        owner,
        creationDateAfter,
        creationDateBefore,
        canProcess,
    ]);

    const { key } = useParams();
    const hasDownloadPermission = useHasPermission();

    const context = useTableFiltersContext('function');
    const { onPopoverOpen } = context;

    useAssetListDocumentTitleEffect('Functions list', key);

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
                <TableTitle title="Functions" />
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
                        isLoading={fetchingFunctions}
                        onClick={() =>
                            fetchFunctions({
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
                        <Tbody
                            data-cy={fetchingFunctions ? 'loading' : 'loaded'}
                        >
                            {!fetchingFunctions && functionsCount === 0 && (
                                <EmptyTr nbColumns={2} asset="function" />
                            )}
                            {fetchingFunctions ? (
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
                                functions?.map((func) => (
                                    <ClickableTr
                                        key={func.key}
                                        data-key={func.key}
                                        onClick={() =>
                                            setLocationPreserveParams(
                                                compilePath(PATHS.FUNCTION, {
                                                    key: func.key,
                                                })
                                            )
                                        }
                                        data-cy={
                                            hasDownloadPermission(
                                                func.permissions.download
                                            )
                                                ? 'has-download-permissions'
                                                : undefined
                                        }
                                    >
                                        <Td>
                                            <Text fontSize="sm">
                                                {func.name}
                                            </Text>
                                            <Text fontSize="xs">{`Created on ${formatDate(
                                                func.creation_date
                                            )} by ${func.owner}`}</Text>
                                        </Td>
                                        <Td textAlign="right">
                                            <PermissionTag
                                                permission={
                                                    func.permissions.process
                                                }
                                            />
                                        </Td>
                                    </ClickableTr>
                                ))
                            )}
                        </Tbody>
                    </AssetsTable>
                </Box>
                <TablePagination
                    currentPage={page}
                    itemCount={functionsCount}
                />
            </TableFiltersContext.Provider>
        </VStack>
    );
};

export default Functions;
