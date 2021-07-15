/** @jsxRuntime classic */
/** @jsx jsx */
import { RiArrowRightLine } from 'react-icons/ri';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import { Colors, Fonts, Spaces } from '@/assets/theme';
import { useExpandedSection } from '@/hooks';

const CroppedContent = styled.div`
    max-height: 150px;
    margin: 0 -${Spaces.large};
    padding: 0 ${Spaces.large};
    overflow: hidden;
    position: relative;

    &:after {
        position: absolute;
        display: 'block';
        content: '';
        bottom: 0;
        left: 0;
        right: 0;
        height: 20px;
        z-index: 1;
        background-image: linear-gradient(transparent, white);
    }
`;

const ExpandedArea = styled.div`
    position: fixed;
    top: 72px;
    right: 420px;
    bottom: 0;
    width: calc(100vw - 420px);
    background-color: white;
    box-shadow: 0 0 8px 0 ${Colors.border};
    transition: all 0.2s ease-out;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow-x: hidden;
    transition: all 0.2s ease-out;
`;

const hiddenExpandedArea = css`
    overflow: hidden;
    pointer-events: none;
    width: 0;
`;

const ExpandedAreaTitle = styled.div`
    display: flex;
    width: calc(100vw - 420px);
    align-items: center;
    justify-content: space-between;
    padding: ${Spaces.large};
    border-bottom: 1px solid ${Colors.border};
    color: ${Colors.lightContent};
    font-size: ${Fonts.sizes.button};
    position: relative;
`;

const ExpandedAreaContent = styled.div`
    overflow: auto;
    width: calc(100vw - 420px);
    flex-grow: 1;
    padding: ${Spaces.large};
`;

const CloseAreaButton = styled.button`
    position: absolute;
    right: ${Spaces.medium};
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    opacity: 1;

    &:hover {
        opacity: 0.6;
    }

    & > svg {
        width: 20px;
        height: 20px;
    }
`;

interface Props {
    title: string;
    children: React.ReactNode;
}

const ReadMoreButton = styled.button`
    color: ${Colors.primary};
    text-decoration: underline;
    padding: 0;
    margin-top: ${Spaces.medium};
    border: none;
    background: none;
`;

const ExpandableSiderSection = ({ title, children }: Props): JSX.Element => {
    const [expanded, setExpanded] = useExpandedSection(title);

    return (
        <SiderSection>
            <SiderSectionTitle>{title}</SiderSectionTitle>
            <CroppedContent>{children}</CroppedContent>
            <ExpandedArea css={[!expanded && hiddenExpandedArea]}>
                <ExpandedAreaTitle>
                    {title}
                    <CloseAreaButton onClick={() => setExpanded(false)}>
                        <RiArrowRightLine />
                    </CloseAreaButton>
                </ExpandedAreaTitle>
                <ExpandedAreaContent>{children}</ExpandedAreaContent>
            </ExpandedArea>
            <ReadMoreButton onClick={() => setExpanded(!expanded)}>
                {expanded ? 'read less' : 'read more'}
            </ReadMoreButton>
        </SiderSection>
    );
};

export default ExpandableSiderSection;
