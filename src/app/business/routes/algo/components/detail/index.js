import React from 'react';
import PropTypes from 'prop-types';
import {PulseLoader} from 'react-spinners';
import styled from '@emotion/styled';

import Detail from '../../../../common/components/detail';
import Metadata from './components/metadata';
import Description from '../../../../common/components/detail/components/description';
import {
Tab, TabList, Tabs, TabPanel,
} from '../../../../common/components/detail/components/tabs';
import RoundedButton from '../../../../common/components/roundedButton';
import DownloadSimple from '../../../../common/svg/download-simple';
import {spacingNormal} from '../../../../../../../assets/css/variables/spacing';

const Span = styled('span')`
    margin-right: ${spacingNormal};
`;

const AlgoDetail = ({
    item,
    descLoading,
    ...props
}) => (
    <Detail
        Metadata={Metadata}
        Description={null}
        item={item}
        descLoading={descLoading}
        {...props}
    >
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
                <RoundedButton Icon={DownloadSimple}>
                    Download algo
                </RoundedButton>
            </TabPanel>
        </Tabs>
    </Detail>
);

AlgoDetail.propTypes = {
    item: PropTypes.shape(),
    descLoading: PropTypes.bool,
};

AlgoDetail.defaultProps = {
    item: null,
    descLoading: false,
};

export default AlgoDetail;
