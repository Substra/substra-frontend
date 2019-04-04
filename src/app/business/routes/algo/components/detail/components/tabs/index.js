import React from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';
import styled from '@emotion/styled';

import Description from '../../../../../../common/components/detail/components/description';
import {
    Tab, TabList, Tabs, TabPanel,
} from '../../../../../../common/components/detail/components/tabs';
import RoundedButton from '../../../../../../common/components/roundedButton';
import DownloadSimple from '../../../../../../common/svg/download-simple';
import {spacingNormal} from '../../../../../../../../../assets/css/variables/spacing';

const Span = styled('span')`
    margin-right: ${spacingNormal};
`;

const AlgoTabs = ({descLoading, item, downloadFile}) => (
    <Tabs>
        <TabList>
            <Tab>Description</Tab>
            <Tab>Code</Tab>
        </TabList>
        <TabPanel>
            {descLoading && <PulseLoader size={6} />}
            {!descLoading && <Description item={item} />}
        </TabPanel>
        <TabPanel>
            <Span>The algorithm's source code and Dockerfile are packaged within a zip or tar.gz file.</Span>
            <RoundedButton Icon={DownloadSimple} onClick={downloadFile}>
                Download algo
            </RoundedButton>
        </TabPanel>
    </Tabs>
);


AlgoTabs.propTypes = {
    item: PropTypes.shape(),
    descLoading: PropTypes.bool,
    downloadFile: PropTypes.func.isRequired,
};

AlgoTabs.defaultProps = {
    item: null,
    descLoading: false,
};

export default AlgoTabs;
