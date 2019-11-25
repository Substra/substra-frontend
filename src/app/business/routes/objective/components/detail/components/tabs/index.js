import React from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';
import {noop} from 'lodash';
import styled from '@emotion/styled';
import {
    TabList,
    Tabs,
    TabPanel,
    RoundedButton,
    DownloadSimple,
} from '@substrafoundation/substra-ui';

import Tab from '../../../../../../common/components/detail/components/tabs';
import PermissionsTabPanelContent from '../../../../../../common/components/detail/components/permissionsTabPanelContent';
import ForbiddenDescription from '../../../../../../common/components/detail/components/forbiddenDescription';
import Description from '../../../../../../common/components/detail/components/description';
import {spacingNormal} from '../../../../../../../../../assets/css/variables/spacing';

const Span = styled('span')`
    margin-right: ${spacingNormal};
`;

const ObjectiveTabs = ({
descLoading, descForbidden, item, downloadFile, tabIndex, setTabIndex,
}) => (
    <Tabs
        selectedIndex={tabIndex}
        onSelect={setTabIndex}
    >
        <TabList>
            <Tab>Description</Tab>
            <Tab>Metrics</Tab>
            <Tab>Permissions</Tab>
        </TabList>
        <TabPanel>
            {descLoading && <PulseLoader size={6} />}
            {!descLoading && descForbidden && (
                <ForbiddenDescription
                    model="objective"
                    permissionsTabIndex={2}
                    setTabIndex={setTabIndex}
                />
            )}
            {!descLoading && !descForbidden && <Description item={item} />}
        </TabPanel>
        <TabPanel>
            <Span>The objective's metrics code and Dockerfile are packaged within a zip or tar.gz file.</Span>
            <RoundedButton Icon={DownloadSimple} onClick={downloadFile}>
                Download metrics
            </RoundedButton>
        </TabPanel>
        <TabPanel>
            <PermissionsTabPanelContent
                permissions={item.permissions}
                owner={item.owner}
                asset="objective"
            />
        </TabPanel>
    </Tabs>
);


ObjectiveTabs.propTypes = {
    item: PropTypes.shape(),
    descLoading: PropTypes.bool,
    descForbidden: PropTypes.bool,
    tabIndex: PropTypes.number,
    downloadFile: PropTypes.func,
    setTabIndex: PropTypes.func,
};

ObjectiveTabs.defaultProps = {
    item: null,
    descLoading: false,
    descForbidden: false,
    tabIndex: 0,
    downloadFile: noop,
    setTabIndex: noop,
};

export default ObjectiveTabs;
