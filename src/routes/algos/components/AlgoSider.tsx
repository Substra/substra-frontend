/** @jsx jsx */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import ReactMarkdown from 'react-markdown';
import { useAppDispatch } from '@/hooks';

import { Colors, Fonts, Spaces } from '@/assets/theme';
import KeySiderSection from '@/components/KeySiderSection';
import { retrieveAlgo, retrieveDescription } from '@/modules/algos/AlgosSlice';
import { PATHS, useKeyFromPath } from '@/routes';
import { RootState } from '@/store';
import { unwrapResult } from '@reduxjs/toolkit';
import ExpandableSiderSection from '@/components/ExpandableSiderSection';
import SiderBottomButton from '@/components/SiderBottomButton';
import { AlgoType } from '@/modules/algos/AlgosTypes';
import PermissionSiderSection from '@/components/PermissionSiderSection';

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
`;

const TitleType = styled.div`
    font-size: ${Fonts.sizes.smallBody};
    color: ${Colors.lightContent};
`;

const Title = styled.div`
    font-size: ${Fonts.sizes.h2};
    font-weight: bold;
    color: ${Colors.content};
    margin-bottom: ${Spaces.extraSmall};
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

const AlgoSider = (): JSX.Element => {
    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.ALGO);

    const visible = !!key;

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            dispatch(retrieveAlgo(key))
                .then(unwrapResult)
                .then((algo: AlgoType) => {
                    dispatch(
                        retrieveDescription(algo.description.storage_address)
                    );
                });
        }
    }, [key]);

    const algo = useSelector((state: RootState) => state.algos.algo);
    const description = useSelector(
        (state: RootState) => state.algos.description
    );

    return (
        <Container
            css={[!visible && hiddenContainerStyles]}
            aria-hidden={!visible}
        >
            <TitleContainer>
                <CloseButton onClick={() => setLocation(PATHS.ALGOS)}>
                    X
                </CloseButton>
                <TitleType>Algorithm details</TitleType>
                <Title>
                    {/* TODO: insert spinner instead of algo name */}
                    {algo ? algo.name : 'Algorithm name'}
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
                {algo && (
                    <PermissionSiderSection
                        permission={algo.permissions.process}
                    />
                )}
                {algo && (
                    <SiderBottomButton target={algo.content.storage_address}>
                        Download algo
                    </SiderBottomButton>
                )}
            </ContentContainer>
        </Container>
    );
};

export default AlgoSider;
