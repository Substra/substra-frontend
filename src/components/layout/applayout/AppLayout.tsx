import React from 'react';
import styled from '@emotion/styled';

import { Colors } from '@/assets/theme';
import Header from '@/components/layout/header/Header';

type AppLayoutProps = {
    children: React.ReactNode;
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background-color: ${Colors.background};
    color: ${Colors.content};
    height: 100vh;
    width: 100vw;
`;

const Content = styled.div`
    flex-grow: 1;
    display: flex;
    overflow-x: auto;
    overflow-y: auto;
`;

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
    return (
        <Container>
            <Header title={'Janssen'} />
            <Content>{children}</Content>
        </Container>
    );
};

export default AppLayout;
