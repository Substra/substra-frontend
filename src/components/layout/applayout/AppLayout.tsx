import styled from '@emotion/styled';

import { useAppSelector } from '@/hooks';

import Header from '@/components/layout/header/Header';

import { Colors } from '@/assets/theme';

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
    const isAuthenticated = useAppSelector((state) => state.user.authenticated);
    return (
        <Container>
            {isAuthenticated && <Header />}
            <Content>{children}</Content>
        </Container>
    );
};

export default AppLayout;
