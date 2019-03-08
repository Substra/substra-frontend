import React from 'react';

import Detail from '../../../../common/components/detail';
import {
    Tab, TabList, TabPanel, Tabs,
} from '../../../../common/components/detail/components/tabs';
import Metadata from './components/metadata';
import {withDetailAnalytics} from '../../../../common/components/detail/analytics';
import {withDetailRedux} from '../../../../common/components/detail/redux';
import DataKeysTable from './components/dataKeysTable';
import Description from './components/description';


const DatasetDetail = ({item, addNotification, ...props}) => (
    <Detail
        {...props}
        item={item}
        addNotification={addNotification}
        Metadata={Metadata}
    >
        <Tabs>
            <TabList>
                <Tab>Description</Tab>
                <Tab>Opener</Tab>
                <Tab>Train data</Tab>
                <Tab>Test data</Tab>
            </TabList>
            <TabPanel>
                <Description item={item} />
            </TabPanel>
            <TabPanel>
                {/* todo: add opener */}
            </TabPanel>
            <TabPanel>
                {item && item.trainDataSampleKeys && (
                    <DataKeysTable
                        dataKeys={item.trainDataSampleKeys}
                        addNotification={addNotification}
                        noKeysMessage="This dataset has no train data asset associated yet"
                    />
                )}
            </TabPanel>
            <TabPanel>
                {/* todo: add test data */}
            </TabPanel>
        </Tabs>
    </Detail>
);

DatasetDetail.propTypes = Detail.propTypes;
DatasetDetail.defaultProps = Detail.defaultProps;

export default withDetailRedux(withDetailAnalytics(DatasetDetail));
