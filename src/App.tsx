import { useState } from 'react';

import { Route, Switch, useLocation, useRoute } from 'wouter';

import { Flex, Spinner } from '@chakra-ui/react';

import CookieBanner from '@/features/cookies/CookieBanner';
import useEffectOnce from '@/hooks/useEffectOnce';
import { PATHS } from '@/paths';
import { ROUTES } from '@/routes';
import NotFound from '@/routes/notfound/NotFound';

import AppLayout from '@/components/layout/applayout/AppLayout';

import useAuthStore from './features/auth/useAuthStore';
import useMetadataStore from './features/metadata/useMetadataStore';
import useOrganizationsStore from './features/organizations/useOrganizationsStore';
import UserAwaitingApprovalPage from './routes/users/components/UserAwaitingApprovalPage';

const App = (): JSX.Element => {
    const [, setLocation] = useLocation();
    const [onLoginPage] = useRoute(PATHS.LOGIN);
    const [onResetPage] = useRoute(PATHS.RESET_PASSWORD);
    const [checkingCredentials, setCheckingCredentials] = useState(true);

    const {
        postRefresh,
        fetchingInfo,
        fetchInfo,
        info: { channel },
    } = useAuthStore();
    const { fetchOrganizations, fetchingOrganizations } =
        useOrganizationsStore();
    const { fetchMetadata, fetchingMetadata } = useMetadataStore();
    const fetchingAll =
        fetchingInfo || fetchingMetadata || fetchingOrganizations;
    useEffectOnce(() => {
        /**
         * Perform authentication check at init.
         * If the refreshToken is expired, then redirect to the login page.
         */
        fetchInfo(false);
        const fetchAll = async () => {
            const refreshToken = await postRefresh();
            if (refreshToken !== null) {
                await Promise.all([
                    fetchOrganizations(),
                    fetchInfo(true),
                    fetchMetadata(),
                ]);
            } else if (!onLoginPage && !onResetPage) {
                const url = encodeURI(
                    `${PATHS.LOGIN}?next=${window.location.pathname}${window.location.search}`
                );
                setLocation(url);
            }
            setCheckingCredentials(false);
        };
        fetchAll();
    });

    if (checkingCredentials) {
        return (
            <Flex
                width="100vw"
                height="100vh"
                alignItems="center"
                justifyContent="center"
            >
                <Spinner
                    color="gray.400"
                    size="xl"
                    thickness="4px"
                    label="Loading app"
                />
            </Flex>
        );
    }

    if (!fetchingAll && !channel && !(onLoginPage || onResetPage)) {
        return <UserAwaitingApprovalPage />;
    }

    return (
        <AppLayout>
            <Switch>
                <>
                    {Object.entries(ROUTES).map(([routeName, route]) => (
                        <Route
                            key={routeName}
                            path={route.path}
                            component={route.component}
                        />
                    ))}
                </>
                <Route component={NotFound} />
            </Switch>
            <CookieBanner />
        </AppLayout>
    );
};

export default App;
