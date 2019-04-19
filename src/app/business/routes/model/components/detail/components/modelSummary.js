import React, {Component, Fragment} from 'react';
import {css} from 'emotion';
import styled from '@emotion/styled';
import {noop} from 'lodash';

import PropTypes from 'prop-types';
import CodeSample from '../../../../../common/components/detail/components/codeSample';
import {spacingNormal} from '../../../../../../../../assets/css/variables/spacing';
import {ice} from '../../../../../../../../assets/css/variables/colors';
import {SingleMetadata, MetadataWrapper} from '../../../../../common/components/detail/components/metadata';
import CopyInput from '../../../../../common/components/detail/components/copyInput';
import RoundedButton from '../../../../../common/components/roundedButton';
import DownloadSimple from '../../../../../common/svg/download-simple';

const PseudoSection = styled('div')`
    padding-top: ${spacingNormal};
    border-top: 1px solid ${ice};
    margin-top: ${spacingNormal};
`;

const margins = css`
    margin: ${spacingNormal} 0;
`;

const Span = styled('span')`
    margin-right: ${spacingNormal};
`;

class ModelSummary extends Component {
    downloadModel = () => {
        const {downloadItem, model} = this.props;
        downloadItem({url: model.traintuple.outModel.storageAddress});
    };

    render() {
        const {model} = this.props;
        return (
            <PseudoSection id={model.traintuple.key}>
                <MetadataWrapper>
                    <SingleMetadata label="Train/test split">
                        {model.traintuple.key.slice(0, 4)}
/
                        {model.testtuple ? model.testtuple.key.slice(0, 4) : 'none'}
                    </SingleMetadata>
                </MetadataWrapper>
                {model && model.traintuple && (
                    (model.traintuple.status === 'todo' && <p>Preparing training.</p>)
                    || (model.traintuple.status === 'doing' && <p>Undergoing training.</p>)
                    || (model.traintuple.status === 'failed' && <p>Training failed.</p>)
                    || (model.traintuple.status === 'done' && (
                        <Fragment>
                            {!model.testtuple && (
                                <Fragment>
                                    <p>
                                        {'Training successful. In order to test this model, execute the following command:'}
                                    </p>
                                    <CopyInput
                                        value={`substra add testtuple '{"traintuple_key": "${model.traintuple.key}"}'`}
                                        isPrompt
                                    />
                                </Fragment>
                            )}
                            {model.testtuple && (
                                (model.testtuple.status === 'todo' && <p>Training successful. Preparing testing.</p>)
                                || (model.testtuple.status === 'doing'
                                    && <p>Training successful. Undergoing testing.</p>)
                                || (model.testtuple.status === 'failed'
                                    && <p>Training successful. Preparing testing.</p>)
                                || (model.testtuple.status === 'done' && (
                                    <p>
                                        <Span>
                                            Model successfully trained with a score
                                        of
                                            {' '}
                                            <b>{model.testtuple.dataset.perf}</b>
                                            {' '}
on this split's
                                        test data samples.
                                        </Span>
                                        <RoundedButton
                                            Icon={DownloadSimple}
                                            onClick={this.downloadModel}
                                        >
                                            Download model
                                        </RoundedButton>
                                    </p>
                                ))
                            )}
                        </Fragment>
                    ))
                )}
                <CodeSample
                    className={margins}
                    filename="traintuple.json"
                    language="json"
                    collapsible
                    codeString={JSON.stringify(model.traintuple, null, 2)}
                />
                {model && model.testtuple && (
                    <CodeSample
                        className={margins}
                        filename="testtuple.json"
                        language="json"
                        collapsible
                        codeString={JSON.stringify(model.testtuple, null, 2)}
                    />
                )}
            </PseudoSection>
        );
    }
}

ModelSummary.propTypes = {
    model: PropTypes.shape(),
    downloadItem: PropTypes.func,
};

ModelSummary.defaultProps = {
    model: null,
    downloadItem: noop,
};

export default ModelSummary;
