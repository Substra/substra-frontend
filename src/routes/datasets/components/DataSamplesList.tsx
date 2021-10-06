/** @jsxRuntime classic */

/** @jsx jsx */
import { IconButton } from '@chakra-ui/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { RiFileDownloadLine } from 'react-icons/ri';

import { useAppSelector } from '@/hooks';

import CopyButton from '@/components/CopyButton';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const Container = styled.div`
    position: relative;
`;

const ActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    border-bottom: 1px solid ${Colors.border};
`;

const copyButtonStyles = css`
    position: absolute;
    top: -${Spaces.small};
    right: -${Spaces.small};
`;

const Title = styled.div`
    font-weight: bold;
    padding-bottom: ${Spaces.small};
    color: ${Colors.content};
    margin-right: ${Spaces.small};
`;

const Li = styled.li`
    font-size: ${Fonts.sizes.smallBody};
    margin: ${Spaces.small} 0;
`;

interface DataSamplesListProps {
    title: string;
    keys: string[];
    sampleType: string;
}

const DataSamplesList = ({
    title,
    keys,
    sampleType,
}: DataSamplesListProps): JSX.Element => {
    const dataset = useAppSelector((state) => state.datasets.dataset);

    const datasetName = dataset?.name || '';
    const datasetKey = dataset?.key || '';

    const onDownload = () => {
        const content = JSON.stringify(keys);
        const fileName = `${datasetName}_${datasetKey}_${sampleType}_data_samples`;

        const a = document.createElement('a');
        const file = new Blob([content], { type: 'application/json' });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    };

    return (
        <Container>
            <Title>{title}</Title>
            <CopyButton css={copyButtonStyles} value={JSON.stringify(keys)}>
                copy as json array
            </CopyButton>
            <ActionsContainer>
                {keys.length > 0 && (
                    <IconButton
                        aria-label="download as a json file"
                        icon={<RiFileDownloadLine />}
                        onClick={onDownload}
                    />
                )}
            </ActionsContainer>
            <ul>
                {keys.map((key) => (
                    <Li key={key}>{key}</Li>
                ))}
            </ul>
        </Container>
    );
};

export default DataSamplesList;
