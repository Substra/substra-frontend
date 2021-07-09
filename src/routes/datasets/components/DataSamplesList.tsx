/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { Colors, Fonts, Spaces } from '@/assets/theme';
import CopyButton from '@/components/CopyButton';

const Container = styled.div`
    position: relative;
`;

const copyButtonStyles = css`
    position: absolute;
    top: -${Spaces.small};
    right: -${Spaces.small};
`;

const Title = styled.div`
    font-weight: bold;
    padding-bottom: ${Spaces.small};
    border-bottom: 1px solid ${Colors.border};
    color: ${Colors.content};
`;

const Li = styled.li`
    font-size: ${Fonts.sizes.smallBody};
    margin: ${Spaces.small} 0;
`;

interface DataSamplesListProps {
    title: string;
    keys: string[];
}

const DataSamplesList = ({
    title,
    keys,
}: DataSamplesListProps): JSX.Element => {
    return (
        <Container>
            <Title>{title}</Title>
            <CopyButton css={copyButtonStyles} value={JSON.stringify(keys)}>
                copy as json array
            </CopyButton>
            <ul>
                {keys.map((key) => (
                    <Li key={key}>{key}</Li>
                ))}
            </ul>
        </Container>
    );
};

export default DataSamplesList;
