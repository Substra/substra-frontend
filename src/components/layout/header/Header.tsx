import HeaderNavigation from './HeaderNavigation';
import HeaderVersions from './HeaderVersions';
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
import styled from '@emotion/styled';
import { unwrapResult } from '@reduxjs/toolkit';
import { RiUser3Fill } from 'react-icons/ri';
import { Link, useLocation, useRoute } from 'wouter';

import { logOut } from '@/modules/user/UserSlice';

import { useAppDispatch, useAppSelector } from '@/hooks';

import { PATHS } from '@/routes';

import OwkinConnectIconSvg from '@/assets/svg/owkin-connect-icon-black-and-white.svg';

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
        label: 'Algorithms',
        href: PATHS.ALGOS,
        paths: [PATHS.ALGO, PATHS.ALGOS],
    },
    {
        label: 'Metrics',
        href: PATHS.METRICS,
        paths: [PATHS.METRIC, PATHS.METRICS],
    },
];

const Header = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();

    const nodeId = useAppSelector((state) => state.nodes.info.node_id);
    const channel = useAppSelector((state) => state.nodes.info.channel);

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
            <IconLink href={PATHS.HOME}>
                <a>
                    <OwkinConnectIconSvg />
                </a>
            </IconLink>
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
                        {nodeId} • {channel}
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
                            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                            <MenuDivider color="gray.200" />
                            <HeaderVersions />
                        </MenuList>
                    </Menu>
                </Box>
            </HStack>
        </Flex>
    );
};

export default Header;
