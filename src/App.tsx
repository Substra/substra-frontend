import React, { useEffect } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { Route, Switch, useLocation } from 'wouter';

import AppLayout from '@/components/layout/applayout/AppLayout';
import { refreshToken } from '@/modules/user/UserSlice';
import { ROUTES } from '@/routes';
import NotFound from '@/routes/notfound/NotFound';
import { useAppDispatch } from '@/store';

const App = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();

    useEffect(() => {
        /**
         * Perform authentication check at init.
         * If the refreshToken is expired, then redirect to the login page.
         */
        dispatch(refreshToken())
            .then(unwrapResult)
            .catch(() => {
                // TODO: make sure we are redirected to the current location after login
                setLocation('/login');
            });
    }, [dispatch]);

    return (
        <AppLayout>
            <Switch>
                <>
                    {Object.values(ROUTES).map((route) => (
                        <Route
                            key={route.path}
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
