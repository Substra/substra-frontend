/* global SCORE_PRECISION */
import React from 'react';
import PropTypes from 'prop-types';

import {css} from 'emotion';

import BrowseRelatedLink from '../../../../../common/components/detail/components/browseRelatedLink';
import {
Table, Th, Tr, Td,
} from '../../../../../common/components/detail/components/table';


const largeColumn = css`
    word-break: break-all;
`;


const Leaderboard = ({item}) => (
    <>
        {item && item.leaderboard && item.leaderboard.length ? (
            <Table>
                <thead>
                    <Tr>
                        <Th>Rank</Th>
                        <Th>Algo</Th>
                        <Th>Model</Th>
                        <Th>Score</Th>
                    </Tr>
                </thead>
                <tbody>
                    {item.leaderboard.map((testtuple, index) => (
                        <Tr key={testtuple.key}>
                            <Td>{index + 1}</Td>
                            <Td className={largeColumn}>
                                <BrowseRelatedLink
                                    model="algo"
                                    label={testtuple.algo.name}
                                    filter={`algo:key:${testtuple.algo.key}-OR-composite_algo:key:${testtuple.algo.key}`}
                                />
                            </Td>
                            <Td className={largeColumn}>
                                <BrowseRelatedLink
                                    model="model"
                                    label={testtuple.traintuple_key}
                                    filter={`model:key:${testtuple.traintuple_key}`}
                                />
                            </Td>
                            <Td>
                                {testtuple.perf.toFixed(SCORE_PRECISION)}
                            </Td>
                        </Tr>
                    ))}
                </tbody>
            </Table>
        ) : (
            <p>No model has been evaluated against this objective's test data yet.</p>
        )}
    </>
);

Leaderboard.propTypes = {
    item: PropTypes.shape(),
};

Leaderboard.defaultProps = {
    item: null,
};

export default Leaderboard;
