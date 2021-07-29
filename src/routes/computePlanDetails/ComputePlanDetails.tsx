import { useEffect, useState } from 'react';

import TaskList from './TaskList';
import styled from '@emotion/styled';
import { unwrapResult } from '@reduxjs/toolkit';
import {
    Tabs as ReactTabs,
    TabList as ReactTabList,
    Tab as ReactTab,
    TabPanel,
} from 'react-tabs';

import {
    retrieveComputePlan,
    retrieveComputePlanTestTasks,
} from '@/modules/computePlans/ComputePlansSlice';

import { isEmpty } from '@/libs/utils';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';

import { PATHS } from '@/routes';

import PerfsGraph, { DataType } from '@/components/PerfsGraph';
import Status from '@/components/Status';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex: 1;
    height: 100%;
    background-color: white;
    border-radius: 24px;
    padding: ${Spaces.large};
`;

const PerfContainer = styled.div`
    width: 500px;
    height: 100%;
`;

const Tabs = styled(ReactTabs)``;

const TabList = styled(ReactTabList)`
    display: flex;
    border-bottom: 1px solid ${Colors.border};
    cursor: pointer;
    margin-bottom: ${Spaces.medium};
`;

const Header = styled.div`
    display: flex;
    margin-bottom: ${Spaces.medium};
    flex-direction: column;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: ${Spaces.small} 0;
`;

interface TabProps {
    active: boolean;
}

const Tab = styled(ReactTab)<TabProps>`
    padding-bottom: ${Spaces.small};
    margin-right: ${Spaces.large};
    border-bottom: 2px solid;
    border-bottom-color: ${({ active }) =>
        active ? Colors.primary : 'transparent'};
    font-size: ${Fonts.sizes.button};
    font-weight: ${({ active }) => (active ? 'bold' : 'inherit')};
    color: ${({ active }) => (active ? Colors.primary : Colors.lightContent)};
`;

const Label = styled.span`
    margin-right: ${Spaces.small};
    font-size: ${Fonts.sizes.label};
    color: ${Colors.lightContent};
`;

const Title = styled.span``;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
TabList.tabsRole = 'TabList';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Tab.tabsRole = 'Tab';

const ComputePlanDetails = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_DETAILS);
    const [tabIndex, setTabIndex] = useState(0);

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle(`${key} (compute plan)`),
        []
    );

    useEffect(() => {
        if (key) {
            dispatch(retrieveComputePlan(key))
                .then(unwrapResult)
                .then((computePlan) => {
                    dispatch(retrieveComputePlanTestTasks(computePlan.key));
                });
        }
    }, [key]);

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const computePlanTestTasks = useAppSelector(
        (state) => state.computePlans.computePlanTestTasks
    );

    const perfData: Record<string, DataType> = {};

    const sortedTasks = [...computePlanTestTasks].sort((a, b) => {
        return a.rank - b.rank;
    });

    sortedTasks.forEach((testTask) => {
        if (!perfData[testTask.dataset.worker]) {
            perfData[testTask.dataset.worker] = {
                x: [testTask.rank],
                y: [testTask.dataset.perf],
            };
        } else {
            perfData[testTask.dataset.worker] = {
                x: [...perfData[testTask.dataset.worker].x, testTask.rank],
                y: [
                    ...perfData[testTask.dataset.worker].y,
                    testTask.dataset.perf,
                ],
            };
        }
    });

    return (
        <PageLayout siderVisible={false} navigation={<Navigation />}>
            <Container>
                {computePlan && (
                    <Header>
                        <Row>
                            <Label>Key</Label>
                            <Title>{computePlan.key}</Title>
                        </Row>
                        <Row>
                            <Label>Status</Label>
                            <Status status={computePlan.status} />
                        </Row>
                    </Header>
                )}
                <Tabs
                    selectedIndex={tabIndex}
                    onSelect={(index: number) => setTabIndex(index)}
                >
                    <TabList>
                        <Tab active={tabIndex === 0}>Performance chart</Tab>
                        <Tab active={tabIndex === 1}>Tasks list</Tab>
                    </TabList>

                    <TabPanel>
                        {!isEmpty(perfData) && (
                            <PerfContainer>
                                <PerfsGraph data={perfData} />
                            </PerfContainer>
                        )}
                    </TabPanel>
                    <TabPanel>
                        <TaskList />
                    </TabPanel>
                </Tabs>
            </Container>
        </PageLayout>
    );
};

export default ComputePlanDetails;
