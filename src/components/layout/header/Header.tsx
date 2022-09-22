import styled from '@emotion/styled';
import { unwrapResult } from '@reduxjs/toolkit';
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
} from '@chakra-ui/react';
import { RiUser3Fill } from 'react-icons/ri';

import SubstraLogo from '@/assets/svg/substra-logo.svg';
import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { logOut } from '@/modules/me/MeSlice';
import { PATHS } from '@/paths';

import OmniSearch from '@/components/OmniSearch';
import About from '@/components/layout/header/About';
import HeaderNavigation from '@/components/layout/header/HeaderNavigation';
import Help from '@/components/layout/header/Help';

import NewsFeed from './NewsFeed';

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
        href: PATHS.TASKS_ROOT,
        paths: [PATHS.TASKS_ROOT, PATHS.TASK, PATHS.TASKS],
    },
    {
        label: 'Datasets',
        href: PATHS.DATASETS,
        paths: [PATHS.DATASET, PATHS.DATASETS],
    },
    {
        label: 'Algorithms',
        href: PATHS.ALGOS,
        paths: [PATHS.ALGO, PATHS.ALGOS],
    },
];

const Header = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();

    const organizationId = useAppSelector(
        (state) => state.me.info.organization_id
    );
    const channel = useAppSelector((state) => state.me.info.channel);
    const userRole = useAppSelector((state) => state.me.info.user_role);

    const handleLogOut = () => {
        dispatch(logOut())
            .then(unwrapResult)
            .then(() => setLocation(PATHS.LOGIN));
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
                        />
                        <MenuList zIndex="popover">
                            {MICROSOFT_CLARITY_ID && (
                                <MenuItem
                                    onClick={() => setLocation(PATHS.SETTINGS)}
                                >
                                    Settings
                                </MenuItem>
                            )}
                            <Help />
                            <About />
                            {userRole === 'ADMIN' && (
                                <MenuItem>
                                    <Link href={PATHS.USERS}>Users</Link>
                                </MenuItem>
                            )}
                            <MenuDivider color="gray.200" />
                            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
                <NewsFeed />
            </HStack>
        </Flex>
    );
};

export default Header;
