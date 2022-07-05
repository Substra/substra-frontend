import { Flex } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';

import Actualizer from '@/components/Actualizer';
import RefreshBanner from '@/components/RefreshBanner';
import Header from '@/components/layout/header/Header';

type AppLayoutProps = {
    children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
    const isAuthenticated = useAppSelector((state) => state.me.authenticated);
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
