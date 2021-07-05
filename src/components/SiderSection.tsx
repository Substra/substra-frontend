import React from 'react';
import styled from '@emotion/styled';

import { Colors, Fonts, Spaces } from '@/assets/theme';

export const SiderSection = styled.div`
    border-bottom: 1px solid ${Colors.border};
    padding: ${Spaces.large} 0;
    position: relative;

    &:last-of-type {
        border-bottom: none;
    }
`;

export const SiderSectionTitle = styled.div`
    color: ${Colors.lightContent};
    margin-bottom: ${Spaces.small};
    font-size: ${Fonts.sizes.button};
`;

interface SimpleSiderSectionProps {
    title: string;
    content: React.ReactNode;
}

export const SimpleSiderSection = ({
    title,
    content,
}: SimpleSiderSectionProps): JSX.Element => (
    <SiderSection>
        <SiderSectionTitle>{title}</SiderSectionTitle>
        {content}
    </SiderSection>
);

export const SiderBottomSection = styled(SiderSection)`
    margin-top: auto;
`;

export default {
    SiderSection,
    SiderSectionTitle,
    SimpleSiderSection,
    SiderBottomSection,
};
