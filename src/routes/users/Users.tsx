import { useEffect } from 'react';

import {
    Box,
    Button,
    HStack,
    Skeleton,
    Td,
    Text,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';

import useAuthStore from '@/features/auth/useAuthStore';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import { useMatch, useOrdering, usePage } from '@/hooks/useSyncedState';
import { compilePath, PATHS } from '@/paths';
import NotFound from '@/routes/notfound/NotFound';
import { UserRolesToLabel } from '@/routes/users/UsersUtils';
import { UserRolesT } from '@/types/UsersTypes';

import { AssetsTable } from '@/components/AssetsTable';
import OrderingTh from '@/components/OrderingTh';
import SearchBar from '@/components/SearchBar';
import { ClickableTr, EmptyTr, TableSkeleton, Tbody } from '@/components/Table';
import TablePagination from '@/components/TablePagination';
import TableTitle from '@/components/TableTitle';

import UserDrawer from './components/UserDrawer';
import useUsersStore from './useUsersStore';

const Users = (): JSX.Element => {
    const setLocationPreserveParams = useSetLocationPreserveParams();
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('username');

    const { users, usersCount, fetchingUsers, fetchUsers } = useUsersStore();
    const {
        info: { user_role: userRole },
    } = useAuthStore();

    const key = useKeyFromPath(PATHS.USER);
    useAssetListDocumentTitleEffect('Users', key);

    useEffect(() => {
        fetchUsers({ page, ordering, match });
    }, [page, key, ordering, match, fetchUsers]);

    if (userRole !== UserRolesT.admin) {
        return <NotFound />;
    }

    return (
        <VStack
            paddingX="6"
            paddingY="8"
            marginX="auto"
            spacing="2.5"
            alignItems="flex-start"
        >
            <UserDrawer />
            <TableTitle title="Users" />
            <HStack width="100%" spacing="2.5" justify="space-between">
                <SearchBar placeholder="Search username..." />
                <Button
                    size="sm"
                    colorScheme="primary"
                    leftIcon={<RiAddLine />}
                    onClick={() =>
                        setLocationPreserveParams(
                            compilePath(PATHS.USER, { key: 'create' })
                        )
                    }
                >
                    Create user
                </Button>
            </HStack>
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
                                options={[
                                    {
                                        label: 'Username',
                                        asc: {
                                            label: 'Sort name A -> Z',
                                            value: 'username',
                                        },
                                        desc: {
                                            label: 'Sort name Z -> A',
                                            value: '-username',
                                        },
                                    },
                                ]}
                            />
                            <OrderingTh
                                options={[
                                    {
                                        label: 'Role',
                                        asc: {
                                            label: 'Sort name A -> Z',
                                            value: 'role',
                                        },
                                        desc: {
                                            label: 'Sort name Z -> A',
                                            value: '-role',
                                        },
                                    },
                                ]}
                            />
                        </Tr>
                    </Thead>
                    <Tbody data-cy={fetchingUsers ? 'loading' : 'loaded'}>
                        {!fetchingUsers && usersCount === 0 && (
                            <EmptyTr nbColumns={2} asset="user" />
                        )}
                        {fetchingUsers ? (
                            <TableSkeleton
                                itemCount={usersCount}
                                currentPage={page}
                                rowHeight="73px"
                            >
                                <Td>
                                    <Skeleton>
                                        <Text fontSize="sm">
                                            Lorem ipsum dolor sit amet
                                        </Text>
                                    </Skeleton>
                                </Td>
                                <Td textAlign="right">
                                    <Skeleton width="100px" height="20px" />
                                </Td>
                            </TableSkeleton>
                        ) : (
                            users.map((user) => (
                                <ClickableTr
                                    key={user.username}
                                    onClick={() =>
                                        setLocationPreserveParams(
                                            compilePath(PATHS.USER, {
                                                key: user.username,
                                            })
                                        )
                                    }
                                >
                                    <Td>
                                        <Text fontSize="sm">
                                            {user.username}
                                        </Text>
                                    </Td>
                                    <Td>
                                        <Text fontSize="sm">
                                            {UserRolesToLabel[user.role]}
                                        </Text>
                                    </Td>
                                </ClickableTr>
                            ))
                        )}
                    </Tbody>
                </AssetsTable>
            </Box>
            <TablePagination currentPage={page} itemCount={usersCount} />
        </VStack>
    );
};

export default Users;
