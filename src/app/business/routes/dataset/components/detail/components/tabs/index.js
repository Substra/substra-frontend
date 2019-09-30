import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';
import styled from '@emotion/styled';
import {noop} from 'lodash';

import {
    CodeSample,
    Tabs,
    TabPanel,
    TabList,
} from '@substrafoundation/substra-ui';

import Tab from '../../../../../../common/components/detail/components/tabs';

import DataKeysTable from '../dataKeysTable';
import CopyInput from '../../../../../../common/components/detail/components/copyInput';

import {fontNormalMonospace, monospaceFamily} from '../../../../../../../../../assets/css/variables/font';
import {ice} from '../../../../../../../../../assets/css/variables/colors';
import Description from '../../../../../../common/components/detail/components/description';
import PermissionsTabPanelContent from '../../../../../../common/components/detail/components/permissionsTabPanelContent';

const Code = styled('code')`
    font-family: ${monospaceFamily};
    font-size: ${fontNormalMonospace};
    border: 1px solid ${ice};
    border-radius: 3px;
    padding: 1px 3px;
`;

const DatasetTabs = ({
descLoading, item, tabIndex, openerLoading, setTabIndex, addNotification,
}) => (
    <Tabs
        selectedIndex={tabIndex}
        onSelect={setTabIndex}
    >
        <TabList>
            <Tab>Description</Tab>
            <Tab>Opener</Tab>
            <Tab>Train data samples</Tab>
            <Tab>Test data samples</Tab>
            <Tab>Permissions</Tab>
        </TabList>
        <TabPanel>
            {descLoading && <PulseLoader size={6} />}
            {!descLoading && <Description item={item} />}
        </TabPanel>
        <TabPanel>
            {openerLoading && <PulseLoader size={6} />}
            {!openerLoading && item && item.opener && item.opener.content && (
                <CodeSample
                    filename="opener.py"
                    language="python"
                    codeString={item.opener.content}
                />
            )}
        </TabPanel>
        <TabPanel>
            {descLoading && <PulseLoader size={6} />}
            {!descLoading && item && item.trainDataSampleKeys && !!item.trainDataSampleKeys.length && (
                <DataKeysTable dataKeys={item.trainDataSampleKeys} addNotification={addNotification} />
            )}
            {!descLoading && item && item.trainDataSampleKeys && !item.trainDataSampleKeys.length && (
                <Fragment>
                    <p>
                        {'No train data samples setup yet.'}
                        <br />
                    </p>
                    <p>
                        {'Use the following command to add new train data samples to this dataset. You\'ll need to fill the '}
                        <Code>data_files</Code>
                        {' key with paths to the assets\' zip or tar.gz files.'}
                    </p>
                    <CopyInput
                        value={`substra add data_sample '{"data_manager_keys": ["${item.key}"], "test_only": false, "files": []}'`}
                        addNotification={addNotification}
                        addNotificationMessage="Command copied to clipboard!"
                        isPrompt
                    />
                </Fragment>
            )}
        </TabPanel>
        <TabPanel>
            {descLoading && <PulseLoader size={6} />}
            {!descLoading && item && item.testDataSampleKeys && !!item.testDataSampleKeys.length && (
                <DataKeysTable dataKeys={item.testDataSampleKeys} addNotification={addNotification} />
            )}
            {!descLoading && item && item.testDataSampleKeys && !item.testDataSampleKeys.length && (
                <Fragment>
                    <p>
                        {'No test data samples setup yet.'}
                        <br />
                    </p>
                    <p>
                        {'Use the following command to add new test data samples to this dataset. You\'ll need to fill the'}
                        <Code>data_files</Code>
                        {' key with paths to the assets\' zip or tar.gz files.'}
                    </p>
                    <CopyInput
                        value={`substra add data_sample '{"data_manager_keys": ["${item.key}"], "test_only": true, "files": []}'`}
                        addNotification={addNotification}
                        addNotificationMessage="Command copied to clipboard!"
                        isPrompt
                    />
                </Fragment>
            )}
        </TabPanel>
        <TabPanel>
            <PermissionsTabPanelContent
                permissions={item.permissions}
                owner={item.owner}
                asset="dataset"
            />
        </TabPanel>
    </Tabs>
);


DatasetTabs.propTypes = {
    item: PropTypes.shape(),
    descLoading: PropTypes.bool,
    tabIndex: PropTypes.number,
    openerLoading: PropTypes.bool,
    setTabIndex: PropTypes.func,
    addNotification: PropTypes.func.isRequired,
};

DatasetTabs.defaultProps = {
    item: null,
    descLoading: false,
    tabIndex: 0,
    openerLoading: false,
    setTabIndex: noop,
};

export default DatasetTabs;
