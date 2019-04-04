import React from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';
import {noop} from 'lodash';

import {
    Tab, TabList, Tabs, TabPanel,
} from '../../../../../../common/components/detail/components/tabs';
import Description from '../../../../../../common/components/detail/components/description';
import CodeSample from '../../../../../../common/components/detail/components/codeSample';


const ObjectiveTabs = ({
descLoading, item, metricsLoading, tabIndex, setTabIndex,
}) => (
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
);


ObjectiveTabs.propTypes = {
    item: PropTypes.shape(),
    descLoading: PropTypes.bool,
    tabIndex: PropTypes.number,
    metricsLoading: PropTypes.bool,
    setTabIndex: PropTypes.func,
};

ObjectiveTabs.defaultProps = {
    item: null,
    descLoading: false,
    tabIndex: 0,
    metricsLoading: false,
    setTabIndex: noop,
};

export default ObjectiveTabs;
