/** @jsxRuntime classic */
/** @jsx jsx */
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { Spaces } from '@/assets/theme';
import CopyButton from '@/components/CopyButton';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';

const copyButtonStyles = css`
    position: absolute;
    top: ${Spaces.medium};
    right: 0;
`;

const Key = styled.div`
    font-weight: bold;
`;

interface KeySiderSectionProps {
    assetKey: string;
}

const KeySiderSection = ({ assetKey }: KeySiderSectionProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>Key</SiderSectionTitle>
            <CopyButton css={copyButtonStyles} value={assetKey}>
                copy key
            </CopyButton>
            <Key>{assetKey}</Key>
        </SiderSection>
    );
};

export default KeySiderSection;
