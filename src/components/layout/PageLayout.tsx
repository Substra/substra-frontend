import React from 'react';
import styled from '@emotion/styled';

import { Colors, Spaces } from '@/assets/theme';

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
    display: flex;
    padding: O 50px;
    justify-content: flex-start;
    align-items: stretch;
    margin: ${Spaces.medium} auto;
    max-width: ${(props) =>
        props.sider ? `calc(~'100vw - ${SIDER_WIDTH})` : ''};
`;

const NavigationContainer = styled.div`
    position: fixed;
    top: 120px;
    left: 32px;
    z-index: 1;
`;

const Sider = styled.div`
    width: ${SIDER_WIDTH}px;
    overflow: auto;
    border-left: 1px solid ${Colors.border};
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
        if (sider) {
            return <Sider>{sider}</Sider>;
        }
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
