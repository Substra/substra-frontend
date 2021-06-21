import React, { useRef, useState, useEffect } from 'react';
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

const HorizontalScrollShadow = styled.div`
    content: '';
    display: block;
    width: 120px;

    // position
    position: absolute;
    z-index: ${zIndexes.stickyHeader + 1};
    left: 0;
    top: 0;
    bottom: 0;
    transform: translateX(0);

    // background
    background-image: linear-gradient(
        to right,
        rgba(247, 249, 248, 1) 40%,
        rgba(247, 249, 248, 0)
    );
    background-size: 120px;
    background-repeat: repeat-y;
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
    // add/remove box shadow on header when sticky
    const [verticallyScrolled, setVerticallyScrolled] = useState(false);
    const onVerticalScroll = (e: React.UIEvent) => {
        const target = e.target as HTMLDivElement;
        setVerticallyScrolled(target.scrollTop > 0);
    };

    // make sure left-side shadow is always positioned to the left of the viewport but still
    // within the HorizontalScrollContainer.
    const horizontalScrollContainerRef = useRef<HTMLDivElement>(null);
    const horizontalScrollShadowRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(); // raf stands for requestAnimationFrame
    useEffect(() => {
        const repositionShadow = () => {
            if (
                horizontalScrollContainerRef.current &&
                horizontalScrollShadowRef.current
            ) {
                const offset = horizontalScrollContainerRef.current.scrollLeft;
                horizontalScrollShadowRef.current.style.transform = `translateX(${offset}px)`;
                rafRef.current = requestAnimationFrame(repositionShadow);
            }
        };

        requestAnimationFrame(() => {
            rafRef.current = requestAnimationFrame(repositionShadow);

            return () => {
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                }
            };
        });
    }, [horizontalScrollContainerRef, horizontalScrollShadowRef]);

    return (
        <Container>
            {navigation}
            <HorizontalScrollContainer ref={horizontalScrollContainerRef}>
                <HorizontalScrollShadow ref={horizontalScrollShadowRef} />
                {stickyHeader && (
                    <StickyHeaderContainer scrolled={verticallyScrolled}>
                        {stickyHeader}
                    </StickyHeaderContainer>
                )}
                <VerticalScrollContainer
                    siderVisible={siderVisible}
                    onScroll={onVerticalScroll}
                >
                    {children}
                </VerticalScrollContainer>
            </HorizontalScrollContainer>
            {sider}
        </Container>
    );
};

export default PageLayout;
