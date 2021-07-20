/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';

import ExpandableSiderSection from '@/components/ExpandableSiderSection';
import {
    SiderSection,
    SiderSectionTitle,
    SimpleSiderSection,
} from '@/components/SiderSection';
import Skeleton from '@/components/Skeleton';

import { Spaces } from '@/assets/theme';

export const LoadingMetadataSiderSection = (): JSX.Element => (
    <SiderSection>
        <SiderSectionTitle>Metadata</SiderSectionTitle>
        <Skeleton
            width={75}
            height={16}
            css={css`
                margin-bottom: ${Spaces.extraSmall};
            `}
        />
        <Skeleton width={250} height={16} />
    </SiderSection>
);

const Table = styled.table`
    border-collapse: separate;
    border-spacing: ${Spaces.large} ${Spaces.extraSmall};
`;

const KeyTd = styled.td`
    font-weight: bold;
`;

const ValueTd = styled.td`
    margin-bottom: ${Spaces.small};
`;

interface MetadataSiderSectionProps {
    metadata: { [key: string]: string };
}
const MetadataSiderSection = ({
    metadata,
}: MetadataSiderSectionProps): JSX.Element => {
    const sortedKeys = Object.keys(metadata);
    sortedKeys.sort();

    if (sortedKeys.length === 0) {
        return (
            <SimpleSiderSection
                title="Metadata"
                content="No metadata setup for this asset."
            />
        );
    }

    return (
        <ExpandableSiderSection title="Metadata">
            <Table>
                <tbody>
                    {sortedKeys.map((key) => (
                        <tr key={key}>
                            <KeyTd>{key}</KeyTd>
                            <ValueTd>{metadata[key]}</ValueTd>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </ExpandableSiderSection>
    );
};

export default MetadataSiderSection;
