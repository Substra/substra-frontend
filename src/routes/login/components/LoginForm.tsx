/** @jsx jsx */
import React, { Fragment, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx, css } from '@emotion/react';
import styled from '@emotion/styled';

import Card from '@/components/Card';
import FormItem from '@/components/FormItem';
import Button from '@/components/Button';
import { H2, BodySmall } from '@/components/Typography';
import { Colors, Spaces } from '@/assets/theme';

type LoginFormProps = {
    submitLogin: (login: string, password: string) => void;
    error: string;
};

const ErrorContainer = styled.div`
    width: 100%;
    margin-top: ${Spaces.medium};
    & > p {
        color: ${Colors.error};
        margin-top: 8px;
    }
`;

const cardStyle = css`
    width: 50%;
    max-width: 420px;
    padding: 48px 32px;
`;

const LoginForm = ({ submitLogin, error }: LoginFormProps): JSX.Element => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    return (
        <Fragment>
            <Card css={cardStyle}>
                <H2 style={{ marginBottom: Spaces.medium }}>
                    Login to Connect
                </H2>
                <FormItem
                    label="Username"
                    placeholder="Enter username"
                    css={{ marginBottom: Spaces.medium }}
                    value={username}
                    onChange={setUsername}
                />
                <FormItem
                    label="Password"
                    type="password"
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                    css={{ marginBottom: Spaces.medium }}
                    value={password}
                    onChange={setPassword}
                />
                <Button
                    onClick={() => submitLogin(username, password)}
                    disabled={!username || !password}
                    type="submit"
                >
                    Login
                </Button>
                {error && (
                    <ErrorContainer>
                        <BodySmall>{error}</BodySmall>
                    </ErrorContainer>
                )}
            </Card>
        </Fragment>
    );
};

export default LoginForm;
