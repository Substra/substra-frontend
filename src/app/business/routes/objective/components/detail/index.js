import React from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';

import Detail from '../../../../common/components/detail/redux';
import {
Tabs, TabList, Tab, TabPanel,
} from '../../../../common/components/detail/components/tabs';
import Metadata from './components/metadata';
import Description from '../../../../common/components/detail/components/description';
import CodeSample from '../../../../common/components/detail/components/codeSample';

const ChallengeDetail = ({
    descLoading,
    metricsLoading,
    item,
    ...props
                }) => (
                    <Detail
                        Metadata={Metadata}
                        Description={null}
                        descLoading={descLoading}
                        item={item}
                        {...props}
                    >
                        <Tabs>
                            <TabList>
                                <Tab>Description</Tab>
                                <Tab>Metrics</Tab>
                            </TabList>
                            <TabPanel>
                                {descLoading && <PulseLoader size={6} />}
                                {!descLoading && <Description item={item} />}
                            </TabPanel>
                            <TabPanel>
                                {metricsLoading && <PulseLoader size={6} />}
                                {!metricsLoading && item && item.metrics && item.metrics.content && (
                                <CodeSample
                                    filename="metrics.py"
                                    language="python"
                                    codeString={item.metrics.content}
                                />
                )}
                            </TabPanel>
                        </Tabs>
                    </Detail>
);

ChallengeDetail.propTypes = {
    descLoading: PropTypes.bool,
    metricsLoading: PropTypes.bool,
    item: PropTypes.shape(),
};

ChallengeDetail.defaultProps = {
    descLoading: false,
    metricsLoading: false,
    item: null,
};

export default ChallengeDetail;
