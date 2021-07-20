/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';

import CloseButton from '@/components/CloseButton';

import { Colors, zIndexes, Spaces, Fonts } from '@/assets/theme';

const Container = styled.div`
    position: fixed;
    top: 72px;
    right: 0;
    bottom: 0;
    width: 420px;
    background-color: white;
    box-shadow: 0 0 8px 0 ${Colors.border};
    transition: all 0.2s ease-out;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;
    z-index: ${zIndexes.sider};
`;

const hiddenContainerStyles = css`
    opacity: 0;
    pointer-events: none;
    right: -420px;
`;

const TitleContainer = styled.div`
    width: 100%;
    border-bottom: 1px solid ${Colors.border};
    padding: ${Spaces.medium} ${Spaces.large} ${Spaces.large} ${Spaces.large};
`;

const closeButtonPosition = css`
    position: absolute;
    top: 0;
    right: 0;
`;

const TitleType = styled.div`
    font-size: ${Fonts.sizes.smallBody};
    color: ${Colors.lightContent};
    margin-bottom: ${Spaces.extraSmall};
`;

const Title = styled.div`
    font-size: ${Fonts.sizes.h2};
    font-weight: bold;
    color: ${Colors.content};
    word-break: break-all;
`;

const ContentContainer = styled.div`
    padding: 0 ${Spaces.large};
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
`;

const FooterContainer = styled.div`
    width: 100%;
    border-top: 1px solid ${Colors.border};
`;

interface SiderProps {
    visible: boolean;
    onCloseButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    title: React.ReactNode;
    titleType: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const Sider = ({
    visible,
    onCloseButtonClick,
    title,
    titleType,
    children,
    footer,
}: SiderProps): JSX.Element => {
    return (
        <Container
            css={[!visible && hiddenContainerStyles]}
            aria-hidden={!visible}
        >
            <TitleContainer>
                <CloseButton
                    css={closeButtonPosition}
                    onClick={onCloseButtonClick}
                />
                <TitleType>{titleType}</TitleType>
                <Title>{title}</Title>
            </TitleContainer>
            <ContentContainer>{children}</ContentContainer>
            {footer && <FooterContainer>{footer}</FooterContainer>}
        </Container>
    );
};
export default Sider;
