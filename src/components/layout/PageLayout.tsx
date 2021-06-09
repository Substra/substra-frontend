import React, { useState } from 'react';
import styled from '@emotion/styled';

import { Colors, Mixins, Spaces, zIndexes } from '@/assets/theme';

const SIDER_WIDTH = 420;

const Container = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
`;

const HorizontalScrollContainer = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
`;

interface VerticalScrollContainerProps {
    siderVisible: boolean;
}

const VerticalScrollContainer = styled.div<VerticalScrollContainerProps>`
    height: 100%;
    width: fit-content;
    min-width: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    // right padding grows when the sider is visible
    padding: ${Spaces.large}
        ${({ siderVisible }) =>
            siderVisible ? `${SIDER_WIDTH + 120}px` : '120px'}
        ${Spaces.large} 120px;
    // transition has to be the same as for the sider sliding in and out of view so that both sider and table move together
    transition: all 0.2s ease-out;
`;

const NavigationContainer = styled.div`
    position: fixed;
    top: 96px;
    z-index: ${zIndexes.navigation};
    min-width: 150px;
    height: 100vh;
    padding-left: ${Spaces.extraLarge};
    background-image: linear-gradient(
        to right,
        rgba(247, 249, 248, 1) 40%,
        rgba(247, 249, 248, 0)
    );
`;

interface StickyHeaderContainerProps {
    scrolled: boolean;
}
const StickyHeaderContainer = styled.div<StickyHeaderContainerProps>`
    position: absolute;
    top: 0;
    left: 120px;
    z-index: ${zIndexes.stickyHeader};
    padding-top: ${Spaces.large};
    background-image: linear-gradient(
        ${Colors.background} 0% calc(100% - 20px),
        transparent calc(100% - 20px) 100%
    );

    &:after {
        display: block;
        content: '';
        position: absolute;
        box-shadow: 0 0 8px 0 ${Colors.border};
        left: 0;
        right: 0;
        bottom: ${Spaces.extraSmall};
        height: ${Spaces.medium};
        border-radius: 0 0 ${Spaces.medium} ${Spaces.medium};
        z-index: -1;
        opacity: ${({ scrolled }) => (scrolled ? 1 : 0)};
        transition: ${Mixins.transitionStyle};
    }
`;

type PageLayoutProps = {
    children: React.ReactNode;
    navigation?: React.ReactNode;
    sider?: React.ReactNode;
    siderVisible: boolean;
    stickyHeader?: React.ReactNode;
};

const PageLayout = ({
    children,
    navigation,
    sider,
    siderVisible,
    stickyHeader,
}: PageLayoutProps): JSX.Element => {
    const [scrolled, setScrolled] = useState(false);

    const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrolled(e.target.scrollTop > 0);
    };

    return (
        <Container onScroll={onScroll}>
            {navigation && (
                <NavigationContainer>{navigation}</NavigationContainer>
            )}
            <HorizontalScrollContainer>
                {stickyHeader && (
                    <StickyHeaderContainer scrolled={scrolled}>
                        {stickyHeader}
                    </StickyHeaderContainer>
                )}
                <VerticalScrollContainer
                    siderVisible={siderVisible}
                    onScroll={onScroll}
                >
                    {children}
                </VerticalScrollContainer>
            </HorizontalScrollContainer>
            {sider}
        </Container>
    );
};

export default PageLayout;
