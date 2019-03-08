import React from 'react';
import PropTypes from 'prop-types';

import {PulseLoader} from 'react-spinners';

import Detail from '../../../../common/components/detail';
import {
    Tab, TabList, TabPanel, Tabs,
} from '../../../../common/components/detail/components/tabs';
import Metadata from './components/metadata';
import DataKeysTable from './components/dataKeysTable';
import Description from './components/description';
import CodeSample from '../../../../common/components/detail/components/codeSample';


const DatasetDetail = ({
item, addNotification, openerLoading, ...props
}) => (
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
                {openerLoading && <PulseLoader size={6} />}
                {!openerLoading && item.opener && item.opener.content && (
                    <CodeSample
                        codeString={item.opener.content}
                        filename="opener.py"
                        language="python"
                    />
                )}
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

DatasetDetail.propTypes = {
    ...Detail.propTypes,
    openerLoading: PropTypes.bool,
};

DatasetDetail.defaultProps = {
    ...Detail.defaultProps,
    openerLoading: false,
};

export default DatasetDetail;
