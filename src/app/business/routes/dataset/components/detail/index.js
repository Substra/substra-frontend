import React from 'react';
import PropTypes from 'prop-types';

import {PulseLoader} from 'react-spinners';
import styled from '@emotion/styled';
import {noop} from 'lodash';

import Detail from '../../../../common/components/detail';
import {
Tab, TabList, TabPanel, Tabs,
} from '../../../../common/components/detail/components/tabs';
import Metadata from './components/metadata';
import DataKeysTable from './components/dataKeysTable';
import Description from './components/description';
import CopyInput from '../../../../common/components/detail/components/copyInput';
import {fontNormalMonospace, monospaceFamily} from '../../../../../../../assets/css/variables/font';
import {ice} from '../../../../../../../assets/css/variables/colors';
import CodeSample from '../../../../common/components/detail/components/codeSample';

const Code = styled('code')`
    font-family: ${monospaceFamily};
    font-size: ${fontNormalMonospace};
    border: 1px solid ${ice};
    border-radius: 3px;
    padding: 1px 3px;
`;


const DatasetDetail = ({
    item,
    addNotification,
    descLoading,
    openerLoading,
    tabIndex,
    setTabIndex,
    ...props
    }) => (
        <Detail
            {...props}
            item={item}
            addNotification={addNotification}
            Metadata={Metadata}
        >
            <Tabs
                selectedIndex={tabIndex}
                onSelect={setTabIndex}
            >
                <TabList>
                    <Tab>Description</Tab>
                    <Tab>Opener</Tab>
                    <Tab>Train data samples</Tab>
                    <Tab>Test data samples</Tab>
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
                        <React.Fragment>
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
                        </React.Fragment>
                    )}
                </TabPanel>
                <TabPanel>
                    {descLoading && <PulseLoader size={6} />}
                    {!descLoading && item && item.testDataSampleKeys && !!item.testDataSampleKeys.length && (
                        <DataKeysTable dataKeys={item.testDataSampleKeys} addNotification={addNotification} />
                    )}
                    {!descLoading && item && item.testDataSampleKeys && !item.testDataSampleKeys.length && (
                        <React.Fragment>
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
                        </React.Fragment>
                    )}
                </TabPanel>
            </Tabs>
        </Detail>
    );

DatasetDetail.propTypes = {
    ...Detail.propTypes,
    openerLoading: PropTypes.bool,
    tabIndex: PropTypes.number,
    setTabIndex: PropTypes.func,
};

DatasetDetail.defaultProps = {
    ...Detail.defaultProps,
    openerLoading: false,
    tabIndex: 0,
    setTabIndex: noop,
};

export default DatasetDetail;
