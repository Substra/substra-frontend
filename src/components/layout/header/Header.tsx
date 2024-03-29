import styled from '@emotion/styled';
import { Link, useLocation, useRoute } from 'wouter';

import {
    Flex,
    Text,
    Box,
    HStack,
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
    MenuDivider,
    IconButton,
    Icon,
    Link as ChakraLink,
    MenuGroup,
} from '@chakra-ui/react';
import { RiUser3Fill } from 'react-icons/ri';

import SubstraLogo from '@/assets/svg/substra-logo.svg';
import useAuthStore from '@/features/auth/useAuthStore';
import NewsFeed from '@/features/newsFeed/NewsFeed';
import { PATHS } from '@/paths';

import About from '@/components/layout/header/About';
import HeaderNavigation from '@/components/layout/header/HeaderNavigation';
import Help from '@/components/layout/header/Help';
import OmniSearch from '@/components/layout/header/OmniSearch';

const IconLink = styled(Link)`
    cursor: pointer;
`;

const isActive = (paths: string[]): boolean => {
    return paths.reduce((isActive: boolean, path: string): boolean => {
        // We could add a test returning true if isActive is true before calling useRoute for
        // maximum efficiency but this would change the number of times the useRoute hook is
        // called and therefore make react break.
        const [isRouteActive] = useRoute(path);
        return isActive || isRouteActive;
    }, false);
};

const NAV_ITEMS = [
    {
        label: 'Compute plans',
        href: PATHS.COMPUTE_PLANS,
        paths: [
            PATHS.COMPUTE_PLAN_CHART,
            PATHS.COMPUTE_PLAN_TASK,
            PATHS.COMPUTE_PLAN_TASKS,
            PATHS.COMPUTE_PLAN_WORKFLOW,
            PATHS.COMPUTE_PLANS,
            PATHS.COMPARE,
        ],
    },
    {
        label: 'Tasks',
        href: PATHS.TASKS,
        paths: [PATHS.TASK, PATHS.TASKS],
    },
    {
        label: 'Datasets',
        href: PATHS.DATASETS,
        paths: [PATHS.DATASET, PATHS.DATASETS],
    },
    {
        label: 'Functions',
        href: PATHS.FUNCTIONS,
        paths: [PATHS.FUNCTION, PATHS.FUNCTIONS],
    },
];

const Header = (): JSX.Element => {
    const [, setLocation] = useLocation();

    const {
        info: {
            organization_id: organizationId,
            channel,
            user_role: userRole,
            user: username,
        },
        fetchLogout,
    } = useAuthStore();

    const handleLogOut = async () => {
        await fetchLogout();
        setLocation(PATHS.LOGIN);
    };

    const isMainRouteActive = !isActive([
        PATHS.COMPARE,
        PATHS.COMPUTE_PLAN_CHART,
        PATHS.COMPUTE_PLAN_TASKS,
        PATHS.COMPUTE_PLAN_TASK,
        PATHS.COMPUTE_PLAN_WORKFLOW,
    ]);

    return (
        <Flex
            height={isMainRouteActive ? '55px' : '44px'}
            alignItems="center"
            justifyContent="space-between"
            paddingLeft="8"
            paddingRight="8"
            borderBottom="1px solid var(--chakra-colors-gray-200)"
            backgroundColor="white"
            flexShrink={0}
            transition="height 300ms ease-in-out"
            data-user-role={userRole}
        >
            <HStack spacing="5">
                <IconLink href={PATHS.HOME}>
                    <a>
                        <SubstraLogo />
                    </a>
                </IconLink>
                <OmniSearch />
            </HStack>
            <HeaderNavigation navItems={NAV_ITEMS} isActive={isActive} />
            <HStack spacing="3.5">
                <Box textAlign="right">
                    <Text
                        color="gray.800"
                        fontSize="xs"
                        lineHeight="120%"
                        height={isMainRouteActive ? '14px' : '0'}
                        overflow="hidden"
                        opacity={isMainRouteActive ? 1 : 0}
                        transitionProperty="height,opacity"
                        transitionDuration="200ms"
                        transitionTimingFunction="ease-in-out"
                    >
                        Connected to
                    </Text>
                    <Text
                        color="gray.800"
                        fontSize="xs"
                        lineHeight="120%"
                        fontWeight="medium"
                    >
                        {organizationId} • {channel}
                    </Text>
                </Box>
                <Box>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={<Icon as={RiUser3Fill} color="gray.400" />}
                            variant="solid"
                            colorScheme="gray"
                            size="sm"
                            data-cy="menu-button"
                        />
                        <MenuList zIndex="popover">
                            <MenuGroup title={username} />
                            <MenuDivider color="gray.200" />
                            {userRole === 'ADMIN' && (
                                <MenuItem
                                    onClick={() => setLocation(PATHS.USERS)}
                                    data-cy="users-management"
                                >
                                    Users
                                </MenuItem>
                            )}
                            <MenuItem
                                as={ChakraLink}
                                href="https://docs.substra.org/"
                                isExternal
                                _hover={{ textDecoration: 'none' }}
                                _focus={{
                                    boxShadow: 'none',
                                    background: 'var(--chakra-colors-gray-100)',
                                }}
                                data-cy="documentation"
                            >
                                Documentation
                            </MenuItem>
                            <MenuItem
                                onClick={() => setLocation(PATHS.MANAGE_TOKENS)}
                                data-cy="api-tokens"
                            >
                                API Tokens
                            </MenuItem>
                            <Help />
                            <About />
                            {MICROSOFT_CLARITY_ID && (
                                <MenuItem
                                    onClick={() => setLocation(PATHS.SETTINGS)}
                                >
                                    Settings
                                </MenuItem>
                            )}
                            <MenuDivider color="gray.200" />
                            <MenuItem onClick={handleLogOut} data-cy="logout">
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
                <NewsFeed />
            </HStack>
        </Flex>
    );
};

export default Header;
