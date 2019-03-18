import React from 'react';
import {PulseLoader} from 'react-spinners';

import Detail from '../../../../common/components/detail/redux';
import {
Tabs, TabList, Tab, TabPanel,
} from '../../../../common/components/detail/components/tabs';
import Metadata from './components/metadata';
import Description from '../../../../common/components/detail/components/description';
import MetricsCode from './components/metricsCode';

const ObjectiveDetail = ({
    descLoading,
    item,
    ...props
                }) => (
                    <Detail
                        Metadata={Metadata}
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
                                <MetricsCode />
                            </TabPanel>
                        </Tabs>
                    </Detail>
);

ObjectiveDetail.propTypes = Detail.propTypes;
ObjectiveDetail.defaultProps = Detail.defaultProps;

export default ObjectiveDetail;
