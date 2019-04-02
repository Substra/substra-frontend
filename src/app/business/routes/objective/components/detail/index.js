import React from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';
import {noop} from 'lodash';

import Detail from '../../../../common/components/detail';
import {
Tabs, TabList, Tab, TabPanel,
} from '../../../../common/components/detail/components/tabs';
import Metadata from './components/metadata';
import Description from '../../../../common/components/detail/components/description';
import CodeSample from '../../../../common/components/detail/components/codeSample';

const ObjectiveDetail = ({
    descLoading,
    metricsLoading,
    tabIndex,
    setTabIndex,
    item,
    ...props
                }) => (
                    <Detail
                        Metadata={Metadata}
                        item={item}
                        {...props}
                    >
                        <Tabs
                            selectedIndex={tabIndex}
                            onSelect={setTabIndex}
                        >
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

ObjectiveDetail.propTypes = {
    ...Detail.propTypes,
    metricsLoading: PropTypes.bool,
    tabIndex: PropTypes.number,
    setTabIndex: PropTypes.func,
};

ObjectiveDetail.defaultProps = {
    ...Detail.defaultProps,
    metricsLoading: false,
    tabIndex: 0,
    setTabIndex: noop,
};

export default ObjectiveDetail;
