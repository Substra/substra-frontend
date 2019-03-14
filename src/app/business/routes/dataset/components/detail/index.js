import React from 'react';
import PropTypes from 'prop-types';

import {PulseLoader} from 'react-spinners';
import styled from '@emotion/styled';

import Detail from '../../../../common/components/detail';
import {
    Tab, TabList, TabPanel, Tabs,
} from '../../../../common/components/detail/components/tabs';
import Metadata from './components/metadata';
import DataKeysTable from './components/dataKeysTable';
import Description from './components/description';
import CodeSample from '../../../../common/components/detail/components/codeSample';
import CopyInput from '../../../../common/components/detail/components/copyInput';
import {fontNormalMonospace, monospaceFamily} from '../../../../../../../assets/css/variables/font';
import {ice} from '../../../../../../../assets/css/variables/colors';

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
    openerLoading,
    descLoading,
    ...props
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
                    {descLoading && <PulseLoader size={6} />}
                    {!descLoading && <Description item={item} />}
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
                    {descLoading && <PulseLoader size={6} />}
                    {!descLoading && item && item.trainDataSampleKeys && !!item.trainDataSampleKeys.length && (
                        <DataKeysTable dataKeys={item.trainDataSampleKeys} addNotification={addNotification} />
                    )}
                    {!descLoading && item && item.trainDataSampleKeys && !item.trainDataSampleKeys.length && (
                        <React.Fragment>
                            <p>
                                {'No train data setup yet.'}
                                <br />
                            </p>
                            <p>
                                {'Use the following command to add new train data to this dataset. You\'ll need to fill the '}
                                <Code>data_files</Code>
                                {' key with paths to the assets\' zip or tar.gz files.'}
                            </p>
                            <CopyInput value={`substra add data '{"dataset_keys": ["${item.key}"], "test_only": false, "data_files": []}'`} isPrompt />
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
                                {'No test data setup yet.'}
                                <br />
                            </p>
                            <p>
                                {'Use the following command to add new test data to this dataset. You\'ll need to fill the'}
                                <Code>data_files</Code>
                                {' key with paths to the assets\' zip or tar.gz files.'}
                            </p>
                            <CopyInput value={`substra add data '{"dataset_keys": ["${item.key}"], "test_only": true, "data_files": []}'`} isPrompt />
                        </React.Fragment>
                    )}
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
