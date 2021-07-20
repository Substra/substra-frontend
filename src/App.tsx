import { useEffect } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';
import { Route, Switch, useLocation, useRoute } from 'wouter';

import { listNodes } from '@/modules/nodes/NodesSlice';
import { refreshToken } from '@/modules/user/UserSlice';

import { useAppDispatch } from '@/hooks';

import { ROUTES, PATHS } from '@/routes';
import NotFound from '@/routes/notfound/NotFound';

import AppLayout from '@/components/layout/applayout/AppLayout';

const App = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();
    const [onLoginPage] = useRoute(PATHS.LOGIN);

    useEffect(() => {
        /**
         * Perform authentication check at init.
         * If the refreshToken is expired, then redirect to the login page.
         */
        dispatch(refreshToken())
            .then(unwrapResult)
            .then(
                () => {
                    dispatch(listNodes());
                },
                () => {
                    if (!onLoginPage) {
                        const url = encodeURI(
                            `${PATHS.LOGIN}?next=${window.location.pathname}${window.location.search}`
                        );
                        setLocation(url);
                    }
                }
            );
    }, [dispatch]);

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
        </AppLayout>
    );
};

export default App;
