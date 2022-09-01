import { useState } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';
import { Route, Switch, useLocation, useRoute } from 'wouter';

import { Flex, Spinner } from '@chakra-ui/react';

import useAppDispatch from '@/hooks/useAppDispatch';
import useEffectOnce from '@/hooks/useEffectOnce';
import { refreshToken, retrieveInfo } from '@/modules/me/MeSlice';
import { listMetadata } from '@/modules/metadata/MetadataSlice';
import { listOrganizations } from '@/modules/organizations/OrganizationsSlice';
import { PATHS } from '@/paths';
import { ROUTES } from '@/routes';
import NotFound from '@/routes/notfound/NotFound';

import CookieBanner from '@/components/CookieBanner';
import AppLayout from '@/components/layout/applayout/AppLayout';

const App = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();
    const [onLoginPage] = useRoute(PATHS.LOGIN);
    const [onResetPage] = useRoute(PATHS.RESET_PASSWORD);
    const [checkingCredentials, setCheckingCredentials] = useState(true);

    useEffectOnce(() => {
        /**
         * Perform authentication check at init.
         * If the refreshToken is expired, then redirect to the login page.
         */
        dispatch(retrieveInfo(false));
        dispatch(refreshToken())
            .then(unwrapResult)
            .then(
                () => {
                    return Promise.all([
                        dispatch(listOrganizations()),
                        dispatch(retrieveInfo(true)),
                        dispatch(listMetadata()),
                    ]);
                },
                () => {
                    if (!onLoginPage && !onResetPage) {
                        const url = encodeURI(
                            `${PATHS.LOGIN}?next=${window.location.pathname}${window.location.search}`
                        );
                        setLocation(url);
                    }
                }
            )
            .finally(() => {
                setCheckingCredentials(false);
            });
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
