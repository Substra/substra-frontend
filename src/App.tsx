import { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { unwrapResult } from '@reduxjs/toolkit';
import { Route, Switch, useLocation, useRoute } from 'wouter';

import { listNodes, retrieveInfo } from '@/modules/nodes/NodesSlice';
import { refreshToken } from '@/modules/user/UserSlice';

import { useAppDispatch } from '@/hooks';

import { ROUTES, PATHS } from '@/routes';
import NotFound from '@/routes/notfound/NotFound';

import Spinner from '@/components/Spinner';
import AppLayout from '@/components/layout/applayout/AppLayout';

import { Colors } from '@/assets/theme';

const SpinnerContainer = styled.div`
    align-self: center;
    margin-left: auto;
    margin-right: auto;
    font-size: 72px;
    color: ${Colors.veryLightContent};
`;

const App = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();
    const [onLoginPage] = useRoute(PATHS.LOGIN);
    const [checkingCredentials, setCheckingCredentials] = useState(true);

    useEffect(() => {
        /**
         * Perform authentication check at init.
         * If the refreshToken is expired, then redirect to the login page.
         */
        dispatch(retrieveInfo(false));
        dispatch(refreshToken())
            .then(unwrapResult)
            .then(
                () => {
                    dispatch(listNodes());
                    dispatch(retrieveInfo(true));
                },
                () => {
                    if (!onLoginPage) {
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
    }, []);

    if (checkingCredentials) {
        return (
            <AppLayout>
                <SpinnerContainer>
                    <Spinner />
                </SpinnerContainer>
            </AppLayout>
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
        </AppLayout>
    );
};

export default App;
