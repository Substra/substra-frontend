import React from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';
import styled from '@emotion/styled';
import {noop} from 'lodash';

import DataKeysTable from '../dataKeysTable';
import CopyInput from '../../../../../../common/components/copyInput';

import {fontNormalMonospace, monospaceFamily} from '../../../../../../../../assets/css/variables/font';
import {ice} from '../../../../../../../../assets/css/variables/colors';
import Description from '../../../../../../common/components/detail/components/description';
import PermissionsTabPanelContent from '../../../../../../common/components/detail/components/permissionsTabPanelContent';
import ForbiddenResource from '../../../../../../common/components/detail/components/forbiddenResource';
import {
    Tabs,
    Tab,
    TabList,
    TabPanel,
} from '../../../../../../common/components/tabs';
import CodeSample from '../../../../../../common/components/codeSample';

const Code = styled('code')`
    font-family: ${monospaceFamily};
    font-size: ${fontNormalMonospace};
    border: 1px solid ${ice};
    border-radius: 3px;
    padding: 1px 3px;
`;

const DatasetTabs = ({
    loading, descLoading, descForbidden, item, tabIndex, openerLoading, openerForbidden, setTabIndex, addNotification,
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
            {!descLoading && descForbidden && (
                <ForbiddenResource
                    resource="description"
                    model="dataset"
                    permissionsTabIndex={4}
                    setTabIndex={setTabIndex}
                />
            )}
            {!descLoading && !descForbidden && <Description item={item} />}
        </TabPanel>
        <TabPanel>
            {openerLoading && <PulseLoader size={6} />}
            {!openerLoading && openerForbidden && (
                <ForbiddenResource
                    resource="opener"
                    model="dataset"
                    permissionsTabIndex={4}
                    setTabIndex={setTabIndex}
                />
            )}
            {!openerLoading && !openerForbidden && item && item.opener && item.opener.content && (
                <CodeSample
                    filename="opener.py"
                    language="python"
                    codeString={item.opener.content}
                />
            )}
        </TabPanel>
        <TabPanel>
            {loading && <PulseLoader size={6} />}
            {!loading && item && item.train_data_sample_keys && !!item.train_data_sample_keys.length && (
                <DataKeysTable dataKeys={item.train_data_sample_keys} addNotification={addNotification} />
            )}
            {!loading && item && (!item.train_data_sample_keys || (item.train_data_sample_keys && !item.train_data_sample_keys.length)) && (
                <>
                    <p>
                        No train data samples setup yet.
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
                </>
            )}
        </TabPanel>
        <TabPanel>
            {loading && <PulseLoader size={6} />}
            {!loading && item && item.test_data_sample_keys && !!item.test_data_sample_keys.length && (
                <DataKeysTable dataKeys={item.test_data_sample_keys} addNotification={addNotification} />
            )}
            {!loading && item && (!item.test_data_sample_keys || (item.test_data_sample_keys && !item.test_data_sample_keys.length)) && (
                <>
                    <p>
                        No test data samples setup yet.
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
                </>
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
    loading: PropTypes.bool,
    descLoading: PropTypes.bool,
    descForbidden: PropTypes.bool,
    tabIndex: PropTypes.number,
    openerLoading: PropTypes.bool,
    openerForbidden: PropTypes.bool,
    setTabIndex: PropTypes.func,
    addNotification: PropTypes.func.isRequired,
};

DatasetTabs.defaultProps = {
    item: null,
    loading: false,
    descLoading: false,
    descForbidden: false,
    tabIndex: 0,
    openerLoading: false,
    openerForbidden: false,
    setTabIndex: noop,
};

export default DatasetTabs;
