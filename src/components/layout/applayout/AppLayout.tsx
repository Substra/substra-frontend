import React from 'react';
import styled from '@emotion/styled';
import Header from '@/components/layout/header/Header';

type AppLayoutProps = {
    children: React.ReactNode;
    authenticated: boolean;
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const Content = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 120px;
`;

const AppLayout = ({
    children,
    authenticated,
}: AppLayoutProps): JSX.Element => {
    return (
        <Container>
            {authenticated && <Header title={'Janssen'} />}
            <Content>{children}</Content>
        </Container>
    );
};

export default AppLayout;
