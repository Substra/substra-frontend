import { Flex } from '@chakra-ui/react';

import useAuthStore from '@/features/auth/useAuthStore';
import Actualizer from '@/features/newsFeed/Actualizer';

import RefreshBanner from '@/components/RefreshBanner';
import Header from '@/components/layout/header/Header';

type AppLayoutProps = {
    children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
    const { authenticated: isAuthenticated } = useAuthStore();

    return (
        <Flex
            direction="column"
            align="stretch"
            height="100vh"
            width="100vw"
            minWidth="1200px"
        >
            {isAuthenticated && <Actualizer />}
            {isAuthenticated && <RefreshBanner />}
            {isAuthenticated && <Header />}
            <Flex
                grow="1"
                overflowX="auto"
                overflowY="auto"
                alignItems="flex-start"
            >
                {children}
            </Flex>
        </Flex>
    );
};

export default AppLayout;
