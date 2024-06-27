import { useCallback, useEffect, useState } from 'react';

import { useParams } from 'wouter';

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
    Heading,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    StackDivider,
    StackItem,
} from '@chakra-ui/react';
import { RiAddLine, RiInformationLine } from 'react-icons/ri';

import useAuthStore from '@/features/auth/useAuthStore';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import { useMatch, useOrdering, usePage } from '@/hooks/useSyncedState';
import { compilePath, PATHS } from '@/paths';
import NotFound from '@/routes/notfound/NotFound';
import { UserRolesToLabel } from '@/routes/users/UsersUtils';
import { UserRolesT } from '@/types/UsersTypes';

import SearchBar from '@/components/SearchBar';
import { AssetsTable } from '@/components/table/AssetsTable';
import OrderingTh from '@/components/table/OrderingTh';
import {
    ClickableTr,
    EmptyTr,
    TableSkeleton,
    Tbody,
} from '@/components/table/Table';
import TablePagination from '@/components/table/TablePagination';
import TableTitle from '@/components/table/TableTitle';

import UserAwaitingApproval from './components/UserAwaitingApproval';
import UserDrawer from './components/UserDrawer';
import useUsersStore from './useUsersStore';

const Users = (): JSX.Element => {
    const setLocationPreserveParams = useSetLocationPreserveParams();
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('username');
    const [isRequestAccepted, setIsRequestAccepted] = useState<boolean>(false);
    const {
        users,
        usersAwaitingApproval,
        usersCount,
        usersAwaitingApprovalCount,
        fetchingUsers,
        fetchingUsersAwaitingApproval,
        fetchUsers,
        fetchUsersAwaitingApproval,
    } = useUsersStore();
    const fetchUsersList = useCallback(
        () => fetchUsers({ page, ordering, match }),
        [page, ordering, match, fetchUsers]
    );
    const {
        info: { user_role: userRole },
    } = useAuthStore();

    const { key } = useParams();
    useAssetListDocumentTitleEffect('Users', key);

    useEffect(() => {
        const abortUsers = fetchUsersList();
        const abortUsersAwaitingApproval = fetchUsersAwaitingApproval();
        return () => {
            abortUsers();
            abortUsersAwaitingApproval();
        };
    }, [
        page,
        key,
        ordering,
        match,
        fetchUsersList,
        fetchUsersAwaitingApproval,
    ]);

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
            {isRequestAccepted && (
                <Alert
                    status="info"
                    variant="subtle"
                    overflow="visible"
                    padding="var(--chakra-space-3) var(--chakra-space-4)"
                    marginBottom="10"
                >
                    <AlertIcon as={RiInformationLine} fill="blue.900" />
                    <Box>
                        <AlertTitle>Just accepted? Let them know!</AlertTitle>
                        <AlertDescription lineHeight="4">
                            Some users were successfully accepted. Don't forget
                            to notify them that they now have access to Substra.
                        </AlertDescription>
                    </Box>
                </Alert>
            )}
            {!fetchingUsersAwaitingApproval &&
                usersAwaitingApproval.length > 0 && (
                    <StackItem width="100%" alignItems="flex-start">
                        <HStack marginBottom="2">
                            <Heading
                                textTransform="uppercase"
                                fontWeight="700"
                                size="xxs"
                            >
                                Channel Access Requests
                            </Heading>
                            {usersAwaitingApprovalCount !== 0 && (
                                <Text
                                    bg="red.500"
                                    color="white"
                                    paddingRight={1}
                                    paddingLeft={1}
                                    borderColor="red.500"
                                    borderRadius={3}
                                    fontWeight="semibold"
                                    fontSize="xs"
                                >
                                    {`${usersAwaitingApprovalCount}`}
                                </Text>
                            )}
                        </HStack>
                        <VStack
                            width="100%"
                            borderWidth="1px"
                            borderStyle="solid"
                            borderColor="gray.100"
                            divider={<StackDivider />}
                            spacing={0}
                            marginTop="2"
                            marginBottom="10"
                        >
                            {usersAwaitingApproval.map((user) => (
                                <UserAwaitingApproval
                                    key={user.username}
                                    user={user}
                                    fetchUsersList={fetchUsersList}
                                    setIsRequestAccepted={setIsRequestAccepted}
                                />
                            ))}
                        </VStack>
                    </StackItem>
                )}
            <UserDrawer fetchUsersList={fetchUsersList} />
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
                    data-cy="create-user"
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
                                    data-name={user.username}
                                    data-role={user.role}
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
