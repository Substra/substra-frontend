/** @jsx jsx */
import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { unwrapResult } from '@reduxjs/toolkit';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { RiCloseLine } from 'react-icons/ri';

import { Colors, Fonts, Spaces } from '@/assets/theme';
import ExpandableSiderSection from '@/components/ExpandableSiderSection';
import KeySiderSection from '@/components/KeySiderSection';
import PermissionSiderSection from '@/components/PermissionSiderSection';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import {
    retrieveDataset,
    retrieveDescription,
    retrieveOpener,
} from '@/modules/datasets/DatasetsSlice';
import { PATHS, useKeyFromPath } from '@/routes';
import { useAppDispatch, useAppSelector } from '@/hooks';
import DataSamplesTabs from './DataSamplesTabs';

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
`;

const hiddenContainerStyles = css`
    opacity: 0;
    pointer-events: none;
    right: -420px;
`;

const TitleContainer = styled.div`
    border-bottom: 1px solid ${Colors.border};
    padding: ${Spaces.medium} ${Spaces.large} ${Spaces.large} ${Spaces.large};
`;

const CloseButton = styled.button`
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 1;

    &:hover {
        opacity: 0.6;
    }

    & > svg {
        width: 20px;
        height: 20px;
    }
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
`;

const DescriptionContainer = styled.div`
    padding-left: ${Spaces.large};
    padding-right: ${Spaces.large};
`;

const syntaxHighlighterStyles = css`
    background-color: ${Colors.background} !important;

    & * {
        font-family: monospace;
    }
`;

const DatasetSider = (): JSX.Element => {
    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.DATASET);

    const visible = !!key;

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            dispatch(retrieveDataset(key))
                .then(unwrapResult)
                .then((dataset) => {
                    dispatch(
                        retrieveDescription(dataset.description.storage_address)
                    );
                    dispatch(retrieveOpener(dataset.opener.storage_address));
                });
        }
    }, [key]);

    const dataset = useAppSelector((state) => state.datasets.dataset);
    const description = useAppSelector((state) => state.datasets.description);
    const opener = useAppSelector((state) => state.datasets.opener);

    return (
        <Container
            css={[!visible && hiddenContainerStyles]}
            aria-hidden={!visible}
        >
            <TitleContainer>
                <CloseButton onClick={() => setLocation(PATHS.DATASETS)}>
                    <RiCloseLine />
                </CloseButton>
                <TitleType>Dataset details</TitleType>
                <Title>
                    {/* TODO: insert spinner instead of dataset name */}
                    {dataset ? dataset.name : 'Dataset name'}
                </Title>
            </TitleContainer>
            <ContentContainer>
                <KeySiderSection assetKey={key || ''} />
                {description && (
                    <ExpandableSiderSection title="Description">
                        <DescriptionContainer>
                            <ReactMarkdown children={description} />
                        </DescriptionContainer>
                    </ExpandableSiderSection>
                )}
                {dataset && (
                    <PermissionSiderSection
                        permission={dataset.permissions.process}
                    />
                )}
                {opener && (
                    <ExpandableSiderSection title="Opener">
                        <SyntaxHighlighter
                            language="python"
                            style={githubGist}
                            css={syntaxHighlighterStyles}
                            showLineNumbers={true}
                        >
                            {opener}
                        </SyntaxHighlighter>
                    </ExpandableSiderSection>
                )}
                {dataset && (
                    <SiderSection>
                        <SiderSectionTitle>Data samples</SiderSectionTitle>
                        <DataSamplesTabs
                            trainDataSamples={dataset.test_data_sample_keys}
                            testDataSamples={dataset.test_data_sample_keys}
                        />
                    </SiderSection>
                )}
            </ContentContainer>
        </Container>
    );
};

export default DatasetSider;
