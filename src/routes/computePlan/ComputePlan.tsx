/** @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';

import Navigation from '@/components/layout/navigation/Navigation';
import Card from '@/components/Card';
import PageLayout from '@/components/layout/PageLayout';
import ProgressBar from '@/components/ProgressBar';
import { Spaces } from '@/assets/theme';

const Content = styled.div`
    display: flex;
    flex-direction: row;
`;

const Sider = styled.div`
    display: flex;
`;

const SiderHeader = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${Spaces.medium};
    flex: 1;
`;

const SiderTitle = styled.h2`
    font-weight: 700;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

const Title = styled.h2`
    font-weight: 600;
`;

const cardCss = {
    margin: '40px',
    padding: Spaces.medium,
};

const ComputePlan = (): JSX.Element => {
    const renderSider = () => {
        return (
            <Sider>
                <SiderHeader>
                    <SiderTitle>CP-CLB-Curie-test-2332</SiderTitle>
                    <ProgressBar percentage={70} />
                </SiderHeader>
            </Sider>
        );
    };

    return (
        <PageLayout navigation={<Navigation />} sider={renderSider()}>
            <Content>
                <Row>
                    <Card css={cardCss}>
                        <Title>Compute Plan</Title>
                    </Card>
                    <Card css={cardCss}>
                        <Title>Details</Title>
                    </Card>
                </Row>
            </Content>
        </PageLayout>
    );
};

export default ComputePlan;
