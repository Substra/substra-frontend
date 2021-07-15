import { useEffect } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import styled from '@emotion/styled';

import { H1 } from '@/components/Typography';
import LoginPageSvg from '@/assets/svg/illustrations/illustration-login-page.svg';
import { loginPayload } from '@/modules/user/UserApi';
import { logIn } from '@/modules/user/UserSlice';
import { useLocation } from 'wouter';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { PATHS } from '@/routes';
import { listNodes } from '@/modules/nodes/NodesSlice';

import LoginForm from './components/LoginForm';

const LeftSideContainer = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    padding-right: 32px;
`;

const LoginPageContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    max-width: 1280px;
    margin: 120px auto;
    align-items: flex-start;
`;

const Login = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();

    const authenticated = useAppSelector((state) => state.user.authenticated);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const nextLocation = urlSearchParams.get('next') || PATHS.DATASETS;

    useEffect(() => {
        if (authenticated) {
            setLocation(nextLocation);
        }
    });

    const submitLogin = async (username: string, password: string) => {
        const payload: loginPayload = {
            username,
            password,
        };

        dispatch(logIn(payload))
            .then(unwrapResult)
            .then(
                () => {
                    // Fetch current node name to update the page's header
                    dispatch(listNodes());
                    setLocation(nextLocation);
                },
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                () => {
                    // do nothing if login failed
                }
            );
    };

    const error = useAppSelector((state) => state.user.error);

    return (
        <LoginPageContainer>
            <LeftSideContainer>
                <LoginPageSvg />
                <H1 style={{ margin: '16px 0 8px' }}>
                    Welcome to Owkin Connect
                </H1>
            </LeftSideContainer>
            <LoginForm submitLogin={submitLogin} error={error} />
        </LoginPageContainer>
    );
};

export default Login;
