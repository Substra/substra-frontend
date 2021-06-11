/** @jsx jsx */
import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { Colors, Fonts, Spaces, zIndexes } from '@/assets/theme';
import KeySiderSection from '@/components/KeySiderSection';
import {
    retrieveComputePlan,
    retrieveComputePlanAggregateTuples,
    retrieveComputePlanCompositeTuples,
    retrieveComputePlanTestTuples,
    retrieveComputePlanTrainTuples,
} from '@/modules/computePlans/ComputePlansSlice';
import { PATHS, useKeyFromPath } from '@/routes';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import ProgressBar from '@/components/ProgressBar';
import { unwrapResult } from '@reduxjs/toolkit';
import TupleSiderSection from '@/components/TupleSiderSection';
import ExpandableSiderSection from '@/components/ExpandableSiderSection';
import { RiCloseLine } from 'react-icons/ri';

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
`;

const TitleType = styled.div`
    font-size: ${Fonts.sizes.smallBody};
    color: ${Colors.lightContent};
    margin-bottom: ${Spaces.extraSmall};
`;

const ContentContainer = styled.div`
    padding: 0 ${Spaces.large};
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
`;

const PercentageNumber = styled.div`
    font-size: ${Fonts.sizes.h2};
    font-weight: ${Fonts.weights.heavy};
    margin-bottom: ${Spaces.small};
`;

const TupleText = styled.div`
    padding: ${Spaces.medium} ${Spaces.large};
`;

const ComputePlanSider = (): JSX.Element => {
    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN);

    const visible = !!key;

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (key) {
            dispatch(retrieveComputePlan(key))
                .then(unwrapResult)
                .then((computePlan) => {
                    dispatch(retrieveComputePlanTrainTuples(computePlan.key));
                    dispatch(retrieveComputePlanTestTuples(computePlan.key));
                    dispatch(
                        retrieveComputePlanAggregateTuples(computePlan.key)
                    );
                    dispatch(
                        retrieveComputePlanCompositeTuples(computePlan.key)
                    );
                });
        }
    }, [key]);

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const computePlanTrainTuples = useAppSelector(
        (state) => state.computePlans.computePlanTrainTuples
    );

    const computePlanTestTuples = useAppSelector(
        (state) => state.computePlans.computePlanTestTuples
    );

    const computePlanCompositeTuples = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTuples
    );

    const computePlanAggregateTuples = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTuples
    );

    let percentage = 0;
    if (computePlan) {
        percentage = (computePlan.done_count / computePlan.tuple_count) * 100;
    }

    return (
        <Container
            css={[!visible && hiddenContainerStyles]}
            aria-hidden={!visible}
        >
            <TitleContainer>
                <CloseButton onClick={() => setLocation(PATHS.COMPUTE_PLANS)}>
                    <RiCloseLine />
                </CloseButton>
                <TitleType>Compute plan details</TitleType>
            </TitleContainer>
            <ContentContainer>
                <KeySiderSection assetKey={key || ''} />
                <SiderSection>
                    <SiderSectionTitle>Completion</SiderSectionTitle>
                    <PercentageNumber>{percentage}%</PercentageNumber>
                    <ProgressBar percentage={percentage} />
                </SiderSection>
                <ExpandableSiderSection title="Train tuples">
                    {computePlanTrainTuples.length === 0 && (
                        <TupleText>
                            This compute plan doesn't have any traintuples
                            attached
                        </TupleText>
                    )}
                    {computePlanTrainTuples.map((trainTuple) => (
                        <TupleSiderSection
                            key={trainTuple.key}
                            tuple={trainTuple}
                        />
                    ))}
                </ExpandableSiderSection>
                <ExpandableSiderSection title="Test tuples">
                    {computePlanTestTuples.length === 0 && (
                        <TupleText>
                            This compute plan doesn't have any testtuples
                            attached
                        </TupleText>
                    )}
                    {computePlanTestTuples.map((testTuple) => (
                        <TupleSiderSection
                            key={testTuple.key}
                            tuple={testTuple}
                        />
                    ))}
                </ExpandableSiderSection>
                <ExpandableSiderSection title="Composite tuples">
                    {computePlanCompositeTuples.length === 0 && (
                        <TupleText>
                            This compute plan doesn't have any composite tuples
                            attached
                        </TupleText>
                    )}
                    {computePlanCompositeTuples.map((compositeTuple) => (
                        <TupleSiderSection
                            key={compositeTuple.key}
                            tuple={compositeTuple}
                        />
                    ))}
                </ExpandableSiderSection>
                <ExpandableSiderSection title="Aggregate tuples">
                    {computePlanAggregateTuples.length === 0 && (
                        <TupleText>
                            This compute plan doesn't have any aggregate tuples
                            attached
                        </TupleText>
                    )}
                    {computePlanAggregateTuples.map((aggregateTuple) => (
                        <TupleSiderSection
                            key={aggregateTuple.key}
                            tuple={aggregateTuple}
                        />
                    ))}
                </ExpandableSiderSection>
            </ContentContainer>
        </Container>
    );
};

export default ComputePlanSider;
