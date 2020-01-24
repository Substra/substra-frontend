/* global SCORE_PRECISION */
import React from 'react';
import PropTypes from 'prop-types';

import {capitalize} from 'lodash';

import {
    Table, Tr, Th, Td,
} from '../../../../../common/components/detail/components/table';

const BundleSummary = ({models}) => (
    <Table centered>
        <thead>
            <Tr>
                <Th>Traintuple</Th>
                <Th>Status</Th>
                <Th>Validation Score</Th>
                <Th>Score</Th>
            </Tr>
        </thead>
        <tbody>
            {models.map((model) => (
                <Tr key={model.traintuple.key}>
                    <Td>
                        <a href={`#${model.traintuple.key}`}>{model.traintuple.key.slice(0, 4)}</a>
                    </Td>
                    <Td>
                        {capitalize(model.traintuple.status)}
                    </Td>
                    <Td>
                        {model.nonCertifiedTesttuple && model.nonCertifiedTesttuple.status === 'done' && (
                            <>
                                {model.nonCertifiedTesttuple.dataset.perf.toFixed(SCORE_PRECISION)}
                                {typeof model.nonCertifiedTesttuple.dataset.standardDeviation === 'number' && ` ±${model.nonCertifiedTesttuple.dataset.standardDeviation.toFixed(SCORE_PRECISION)}`}
                            </>
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

BundleSummary.propTypes = {
    models: PropTypes.arrayOf(PropTypes.shape()),
};

BundleSummary.defaultProps = {
    models: [],
};

export default BundleSummary;
