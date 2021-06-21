import React, { useState } from 'react';
import {
    Tabs as ReactTabs,
    TabList as ReactTabList,
    Tab as ReactTab,
    TabPanel,
} from 'react-tabs';

import { Colors, Fonts, Spaces } from '@/assets/theme';

import DataSamplesList from './DataSamplesList';
import styled from '@emotion/styled';

const Tabs = styled(ReactTabs)`
    margin-top: ${Spaces.medium};
`;

const TabList = styled(ReactTabList)`
    display: flex;
    border-bottom: 1px solid ${Colors.border};
    cursor: pointer;
    margin-bottom: ${Spaces.medium};
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
TabList.tabsRole = 'TabList';

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
    color: ${({ active }) => (active ? Colors.primary : Colors.content)};
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Tab.tabsRole = 'Tab';

interface DataSamplesTabsProps {
    trainDataSamples: string[];
    testDataSamples: string[];
}

const DataSamplesTabs = ({
    trainDataSamples,
    testDataSamples,
}: DataSamplesTabsProps): JSX.Element => {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Tabs
            selectedIndex={tabIndex}
            onSelect={(index: number) => setTabIndex(index)}
        >
            <TabList>
                <Tab active={tabIndex === 0}>Train data samples</Tab>
                <Tab active={tabIndex === 1}>Test data samples</Tab>
            </TabList>
            <TabPanel>
                <DataSamplesList
                    title={`${trainDataSamples.length} train data samples`}
                    keys={trainDataSamples}
                />
            </TabPanel>
            <TabPanel>
                <DataSamplesList
                    title={`${testDataSamples.length} test data samples`}
                    keys={testDataSamples}
                />
            </TabPanel>
        </Tabs>
    );
};

export default DataSamplesTabs;
