import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {capitalize, noop} from 'lodash';

import {
    Table, Tr, Th, Td,
} from '../../../../dataset/components/detail/components/table';
import RoundedButton from '../../../../../common/components/roundedButton';
import DownloadSimple from '../../../../../common/svg/download-simple';

class BundleSummary extends Component {
    downloadModel = model => () => {
        const {downloadItem} = this.props;
        downloadItem({url: model.traintuple.outModel.storageAddress});
    };

    render() {
        const {models} = this.props;
        return (
            <Table centered>
                <thead>
                    <Tr>
                        <Th>Traintuple</Th>
                        <Th>Model</Th>
                        <Th>Status</Th>
                        <Th>Non-certified Score</Th>
                        <Th>Score</Th>
                    </Tr>
                </thead>
                <tbody>
                    {models.map(model => (
                        <Tr key={model.traintuple.key}>
                            <Td>
                                <a href={`#${model.traintuple.key}`}>{model.traintuple.key.slice(0, 4)}</a>
                            </Td>
                            <Td>
                                {model.traintuple.status === 'done' && (
                                <RoundedButton
                                    Icon={DownloadSimple}
                                    onClick={this.downloadModel(model)}
                                >
                                    Download
                                </RoundedButton>
                            )}
                                {model.traintuple.status !== 'done' && 'N/A'}
                            </Td>
                            <Td>
                                {capitalize(model.traintuple.status)}
                            </Td>
                            <Td>
                                {model.nonCertifiedTesttuple && model.nonCertifiedTesttuple.status === 'done' ? model.nonCertifiedTesttuple.dataset.perf : 'N/A'}
                            </Td>
                            <Td>
                                {model.testtuple && model.testtuple.status === 'done' ? model.testtuple.dataset.perf : 'N/A'}
                            </Td>
                        </Tr>
                ))}
                </tbody>
            </Table>
        );
    }
}

BundleSummary.propTypes = {
    models: PropTypes.arrayOf(PropTypes.shape()),
    downloadItem: PropTypes.func,
};

BundleSummary.defaultProps = {
    models: [],
    downloadItem: noop,
};

export default BundleSummary;
