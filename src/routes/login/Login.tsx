import React from 'react';
import styled from '@emotion/styled';

import LoginForm from '@/components/loginform/LoginFormContainer';
import { H1 } from '@/components/utils/Typography';
import LoginPageSvg from '@/assets/svg/illustrations/illustration-login-page.svg';

type LoginProps = {
    submitLogin: (username: string, password: string) => void;
};

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
    margin-top: 120px;
`;

const Login = ({ submitLogin }: LoginProps): JSX.Element => {
    return (
        <LoginPageContainer>
            <LeftSideContainer>
                <LoginPageSvg />
                <H1 style={{ margin: '16px 0 8px' }}>
                    Welcome to Owkin Connect
                </H1>
            </LeftSideContainer>
            <LoginForm submitLogin={submitLogin} />
        </LoginPageContainer>
    );
};

export default Login;
