import React from 'react';
import styled from '@emotion/styled';

import { Spaces } from '@/assets/theme';

type PageLayoutProps = {
    children: React.ReactNode;
    navigation?: React.ReactNode;
    sider?: React.ReactNode;
};

const SIDER_WIDTH = 420;

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-grow: 1;
    position: relative;
`;

const ContentContainer = styled.div<PageLayoutProps>`
    padding: 0 120px;
    margin: ${Spaces.medium} 0;
    max-width: ${(props) =>
        props.sider ? `calc(~'100vw - ${SIDER_WIDTH})` : ''};
`;

const NavigationContainer = styled.div`
    position: fixed;
    top: 96px;
    left: 32px;
    z-index: 1;
`;

const PageLayout = ({
    children,
    navigation,
    sider,
}: PageLayoutProps): JSX.Element => {
    const renderNavigation = () => {
        if (navigation) {
            return <NavigationContainer>{navigation}</NavigationContainer>;
        }
    };

    const renderSider = () => {
        return sider;
    };

    const renderContent = () => {
        return <ContentContainer>{children}</ContentContainer>;
    };

    return (
        <Container>
            {renderNavigation()}
            {renderContent()}
            {renderSider()}
        </Container>
    );
};

export default PageLayout;
