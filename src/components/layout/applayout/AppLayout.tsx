import { Flex } from '@chakra-ui/react';

import { useAppSelector } from '@/hooks';

import Header from '@/components/layout/header/Header';

type AppLayoutProps = {
    children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
    const isAuthenticated = useAppSelector((state) => state.user.authenticated);
    return (
        <Flex direction="column" align="stretch" height="100vh" width="100vw">
            {isAuthenticated && <Header />}
            <Flex grow="1" overflowX="auto" overflowY="auto">
                {children}
            </Flex>
        </Flex>
    );
};

export default AppLayout;
