import React from 'react';
import { Route, Switch } from 'wouter';

import AppLayout from '@/components/layout/applayout/AppLayoutContainer';
import { ROUTES } from '@/routes';

const App = (): JSX.Element => {
    return (
        <AppLayout>
            <Switch>
                {Object.values(ROUTES).map((route) => {
                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            component={route.component}
                        />
                    );
                })}
                <Route>404 NOT FOUND</Route>
            </Switch>
        </AppLayout>
    );
};

export default App;
