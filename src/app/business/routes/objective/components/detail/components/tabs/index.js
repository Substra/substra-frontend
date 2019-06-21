/* global IS_OWKESTRA */
import React from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';
import {noop} from 'lodash';

import {
    CodeSample, Tab, TabList, Tabs, TabPanel, colors,
} from '@substrafoundation/substra-ui';
import Description from '../../../../../../common/components/detail/components/description';

const owkestraColors = IS_OWKESTRA ? colors.darkSkyBlue : colors.tealish;

const ObjectiveTabs = ({
descLoading, item, metricsLoading, tabIndex, setTabIndex,
}) => (
    <Tabs
        selectedIndex={tabIndex}
        onSelect={setTabIndex}
    >
        <TabList>
            <Tab color={owkestraColors}>Description</Tab>
            <Tab color={owkestraColors}>Metrics</Tab>
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
