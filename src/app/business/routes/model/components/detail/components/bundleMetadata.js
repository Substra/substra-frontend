import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';

import BaseMetadata, {
    SingleMetadata,
    MetadataWrapper,
    keyLabelClassName,
    keyValueClassName,
} from '../../../../../common/components/detail/components/metadata';
import CopyInput from '../../../../../common/components/detail/components/copyInput';
import InlinePulseLoader from '../../inlinePulseLoader';


const ScoreMetadata = ({item, label, tupleName}) => (
    <SingleMetadata label={label}>
        {!item[tupleName] && 'N/A'}
        {item[tupleName] && item[tupleName].status && item[tupleName].status === 'done' && `${item[tupleName].dataset.perf} ±${item[tupleName].dataset.variance}`}
        {item[tupleName] && item[tupleName].status && item[tupleName].status !== 'done' && (
            <Fragment>
                {capitalize(item[tupleName].status)}
                <InlinePulseLoader loading={['todo', 'doing'].includes(item[tupleName].status)} />
            </Fragment>
        )}
    </SingleMetadata>
);

ScoreMetadata.propTypes = {
    item: PropTypes.shape(),
    label: PropTypes.string,
    tupleName: PropTypes.string,
};

ScoreMetadata.defaultProps = {
    item: null,
    label: '',
    tupleName: '',
};


class Metadata extends Component {
    copy = () => {
        const {item: {tag}, addNotification} = this.props;
        addNotification(tag, 'Bundle\'s tag successfully copied to clipboard!');
    };

    render() {
        const {item} = this.props;
        return (
            <MetadataWrapper>
                <SingleMetadata
                    label="Bundle tag"
                    labelClassName={keyLabelClassName}
                    valueClassName={keyValueClassName}
                >
                    <CopyInput
                        value={item.tag}
                        addNotification={this.copy}
                    />
                </SingleMetadata>
                <SingleMetadata label="Status">
                    {capitalize(item.traintuple.status)}
                    <InlinePulseLoader loading={['todo', 'doing'].includes(item.traintuple.status)} />
                </SingleMetadata>
                <ScoreMetadata
                    label="Non-certified Score"
                    tupleName="nonCertifiedTesttuple"
                    item={item}
                />
                <ScoreMetadata
                    label="Score"
                    tupleName="testtuple"
                    item={item}
                />
            </MetadataWrapper>
        );
    }
}

Metadata.propTypes = BaseMetadata.propTypes;
Metadata.defaultProps = BaseMetadata.defaultProps;

export default Metadata;
