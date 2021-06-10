/** @jsx jsx */
import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { unwrapResult } from '@reduxjs/toolkit';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { RiCloseLine } from 'react-icons/ri';

import { Colors, Fonts, Spaces, zIndexes } from '@/assets/theme';
import KeySiderSection from '@/components/KeySiderSection';
import PermissionSiderSection, {
    LoadingPermissionSiderSection,
} from '@/components/PermissionSiderSection';
import {
    SiderSection,
    SiderSectionTitle,
    SimpleSiderSection,
} from '@/components/SiderSection';
import {
    retrieveDataset,
    retrieveDescription,
    retrieveOpener,
} from '@/modules/datasets/DatasetsSlice';
import { PATHS, useKeyFromPath } from '@/routes';
import { useAppDispatch, useAppSelector } from '@/hooks';
import DataSamplesTabs from './DataSamplesTabs';
import Skeleton from '@/components/Skeleton';
import DescriptionSiderSection, {
    LoadingDescriptionSiderSection,
} from '@/components/DescriptionSiderSection';
import OpenerSiderSection, {
    LoadingOpenerSiderSection,
} from './OpenerSiderSection';

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
    const datasetLoading = useAppSelector(
        (state) => state.datasets.datasetLoading
    );

    const description = useAppSelector((state) => state.datasets.description);
    const descriptionLoading = useAppSelector(
        (state) => state.datasets.descriptionLoading
    );

    const opener = useAppSelector((state) => state.datasets.opener);
    const openerLoading = useAppSelector(
        (state) => state.datasets.openerLoading
    );

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
                    {datasetLoading || !dataset ? (
                        <Skeleton width={370} height={30} />
                    ) : (
                        dataset.name
                    )}
                </Title>
            </TitleContainer>
            <ContentContainer>
                <KeySiderSection assetKey={key || ''} />
                {descriptionLoading && <LoadingDescriptionSiderSection />}
                {!descriptionLoading && !description && (
                    <SimpleSiderSection title="Description" content="N/A" />
                )}
                {!descriptionLoading && description && (
                    <DescriptionSiderSection description={description} />
                )}

                {datasetLoading && <LoadingPermissionSiderSection />}
                {!datasetLoading && !dataset && (
                    <SimpleSiderSection title="Permissions" content="N/A" />
                )}
                {!datasetLoading && dataset && (
                    <PermissionSiderSection
                        permission={dataset.permissions.process}
                    />
                )}

                {openerLoading && <LoadingOpenerSiderSection />}
                {!openerLoading && !opener && (
                    <SimpleSiderSection title="Opener" content="N/A" />
                )}
                {!openerLoading && opener && (
                    <OpenerSiderSection opener={opener} />
                )}

                {dataset && (
                    <SiderSection>
                        <SiderSectionTitle>Data samples</SiderSectionTitle>
                        <DataSamplesTabs
                            trainDataSamples={dataset.train_data_sample_keys}
                            testDataSamples={dataset.test_data_sample_keys}
                        />
                    </SiderSection>
                )}
            </ContentContainer>
        </Container>
    );
};

export default DatasetSider;
