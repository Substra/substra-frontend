/* global SCORE_PRECISION */
import React, {Component, Fragment} from 'react';
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
                        <Th>Status</Th>
                        <Th>Model</Th>
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
                                {capitalize(model.traintuple.status)}
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
                                {model.nonCertifiedTesttuple && model.nonCertifiedTesttuple.status === 'done' && (
                                    <Fragment>
                                        {model.nonCertifiedTesttuple.dataset.perf.toFixed(SCORE_PRECISION)}
                                        {typeof model.nonCertifiedTesttuple.dataset.variance === 'number' && ` ±${model.nonCertifiedTesttuple.dataset.variance.toFixed(SCORE_PRECISION)}`}
                                    </Fragment>
                                )}
                                {model.nonCertifiedTesttuple && model.nonCertifiedTesttuple.status !== 'done' && capitalize(model.nonCertifiedTesttuple.status)}
                                {!model.nonCertifiedTesttuple && 'N/A'}
                            </Td>
                            <Td>
                                {model.testtuple && model.testtuple.status === 'done' && model.testtuple.dataset.perf.toFixed(SCORE_PRECISION)}
                                {model.testtuple && model.testtuple.status !== 'done' && capitalize(model.testtuple.status)}
                                {!model.testtuple && 'N/A'}
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
