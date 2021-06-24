import React from 'react';
import styled from '@emotion/styled';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import { Colors, Spaces, zIndexes } from '@/assets/theme';
import { RiArrowRightLine } from 'react-icons/ri';
import { useExpandedSection } from '@/hooks';

const CollapsibleArea = styled.div`
    max-height: 150px;
    margin-left: -${Spaces.large};
    margin-right: -${Spaces.large};
    overflow-x: visible;
    overflow-y: hidden;
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

interface ExpandedAreaProps {
    expanded: boolean;
}
const ExpandedArea = styled.div<ExpandedAreaProps>`
    position: fixed;
    top: 72px;
    right: 420px;
    bottom: 0;
    width: calc(100% - 420px);
    padding: ${Spaces.large};
    background-color: white;
    box-shadow: 0 0 8px 0 ${Colors.border};
    transition: all 0.2s ease-out;
    display: ${({ expanded }) => (expanded ? 'flex' : 'none')};
    flex-direction: column;
    align-items: stretch;
    overflow-x: hidden;
    z-index: ${zIndexes.sider};
`;

const CloseAreaButton = styled.button`
    width: 68px;
    height: 68px;
    position: absolute;
    top: 0;
    right: 0;
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
            <CollapsibleArea>{children}</CollapsibleArea>
            <ExpandedArea expanded={expanded}>
                <CloseAreaButton onClick={() => setExpanded(false)}>
                    <RiArrowRightLine />
                </CloseAreaButton>
                <SiderSectionTitle>{title}</SiderSectionTitle>
                {children}
            </ExpandedArea>
            <ReadMoreButton onClick={() => setExpanded(!expanded)}>
                {expanded ? 'read less' : 'read more'}
            </ReadMoreButton>
        </SiderSection>
    );
};

export default ExpandableSiderSection;
