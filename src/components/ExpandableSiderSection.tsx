import React, { useState } from 'react';
import styled from '@emotion/styled';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import { Colors, Spaces } from '@/assets/theme';

interface CollapsibleAreaProps {
    expanded: boolean;
}
const CollapsibleArea = styled.div<CollapsibleAreaProps>`
    max-height: ${({ expanded }) => (expanded ? 'none' : '150px')};
    margin-left: -${Spaces.large};
    margin-right: -${Spaces.large};
    overflow-x: ${({ expanded }) => (expanded ? 'visible' : 'hidden')};
    overflow-y: ${({ expanded }) => (expanded ? 'visible' : 'hidden')};
    position: relative;

    &:after {
        position: absolute;
        display: ${({ expanded }) => (expanded ? 'none' : 'block')};
        content: '';
        bottom: 0;
        left: 0;
        right: 0;
        height: 20px;
        z-index: 1;
        background-image: linear-gradient(transparent, white);
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
    const [expanded, setExpanded] = useState(false);

    return (
        <SiderSection>
            <SiderSectionTitle>{title}</SiderSectionTitle>
            <CollapsibleArea expanded={expanded}>{children}</CollapsibleArea>
            <ReadMoreButton onClick={() => setExpanded(!expanded)}>
                {expanded ? 'read less' : 'read more'}
            </ReadMoreButton>
        </SiderSection>
    );
};

export default ExpandableSiderSection;
