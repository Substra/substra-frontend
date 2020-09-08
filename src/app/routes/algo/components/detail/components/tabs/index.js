import React from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';
import styled from '@emotion/styled';
import {noop} from 'lodash';

import Description from '../../../../../../common/components/detail/components/description';
import {spacingNormal} from '../../../../../../../../assets/css/variables/spacing';
import PermissionsTabPanelContent from '../../../../../../common/components/detail/components/permissionsTabPanelContent';
import ForbiddenResource from '../../../../../../common/components/detail/components/forbiddenResource';
import {
    TabList,
    Tab,
    Tabs,
    TabPanel,
} from '../../../../../../common/components/tabs';
import {RoundedButton} from '../../../../../../common/components/roundedButton';
import {DownloadSimple} from '../../../../../../common/components/icons';

const Span = styled('span')`
    margin-right: ${spacingNormal};
`;

const AlgoTabs = ({
descLoading, descForbidden, item, tabIndex, setTabIndex, downloadFile,
}) => (
    <Tabs
        selectedIndex={tabIndex}
        onSelect={setTabIndex}
    >
        <TabList>
            <Tab>Description</Tab>
            <Tab>Code</Tab>
            <Tab>Permissions</Tab>
        </TabList>
        <TabPanel>
            {descLoading && <PulseLoader size={6} />}
            {!descLoading && descForbidden && (
                <ForbiddenResource
                    resource="description"
                    model="algo"
                    permissionsTabIndex={2}
                    setTabIndex={setTabIndex}
                />
            )}
            {!descLoading && !descForbidden && <Description item={item} />}
        </TabPanel>
        <TabPanel>
            <Span>The algorithm's source code and Dockerfile are packaged within a zip or tar.gz file.</Span>
            <RoundedButton Icon={DownloadSimple} onClick={downloadFile}>
                Download algo
            </RoundedButton>
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


AlgoTabs.propTypes = {
    item: PropTypes.shape(),
    descLoading: PropTypes.bool,
    descForbidden: PropTypes.bool,
    tabIndex: PropTypes.number,
    setTabIndex: PropTypes.func,
    downloadFile: PropTypes.func.isRequired,
};

AlgoTabs.defaultProps = {
    item: null,
    descLoading: false,
    descForbidden: false,
    tabIndex: 0,
    setTabIndex: noop,
};

export default AlgoTabs;
