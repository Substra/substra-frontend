/* global SCORE_PRECISION IS_OWKESTRA */
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {noop} from 'lodash';
import {
    CodeSample,
    RoundedButton,
    DownloadSimple,
    Tab,
    TabList,
    Tabs,
    TabPanel,
    colors,
} from '@substrafoundation/substra-ui';

import CopyInput from '../../../../../../common/components/detail/components/copyInput';
import {spacingNormal} from '../../../../../../../../../assets/css/variables/spacing';
import {
    AlertWrapper, AlertTitle, AlertActions, AlertInlineButton,
} from '../../../../../../common/components/alert';

const owkestraColors = IS_OWKESTRA ? colors.darkSkyBlue : colors.tealish;

const Span = styled('span')`
    margin-right: ${spacingNormal};
`;


class ModelTabs extends Component {
    state = {
        tabIndex: 0,
    };

    setTabIndex = (tabIndex) => {
        this.setState({tabIndex});
    };

    gotoTesttuple = () => {
        this.setTabIndex(1);
    };

    render() {
        const {item, addNotification, downloadFile} = this.props;
        const {tabIndex} = this.state;

        return (
            <Fragment>
                {item && item.traintuple && item.traintuple.status === 'done' && !item.testtuple && (
                <AlertWrapper>
                    <AlertTitle>This model has not been tested yet</AlertTitle>
                    <AlertActions>
                        <AlertInlineButton onClick={this.gotoTesttuple}>learn more</AlertInlineButton>
                    </AlertActions>
                </AlertWrapper>
            )}
                <Tabs
                    selectedIndex={tabIndex}
                    onSelect={this.setTabIndex}
                >
                    <TabList>
                        <Tab color={owkestraColors}>Traintuple/Model</Tab>
                        <Tab color={owkestraColors}>Testtuple</Tab>
                    </TabList>
                    <TabPanel>
                        {item && item.traintuple && item.traintuple.status === 'done' && (
                        <p>
                            <Span>
                                {'Model successfully trained with a score of '}
                                <b>{item.traintuple.dataset.perf.toFixed(SCORE_PRECISION)}</b>
                                {' on '}
                                <b>train data samples</b>
                                .
                            </Span>
                            <RoundedButton Icon={DownloadSimple} onClick={downloadFile}>
                                Download model
                            </RoundedButton>
                        </p>
                    )}
                        <CodeSample
                            filename="traintuple.json"
                            language="json"
                            codeString={JSON.stringify(item.traintuple, null, 2)}
                        />
                    </TabPanel>
                    <TabPanel>
                        {item.testtuple && (
                        <Fragment>
                            <CodeSample
                                filename="testtuple.json"
                                language="json"
                                codeString={JSON.stringify(item.testtuple, null, 2)}
                            />
                        </Fragment>
                    )}
                        {item.traintuple && !item.testtuple && (
                        (item.traintuple.status === 'done' && (
                            <Fragment>
                                <p>
                                    {'In order to test this model, execute the following command:'}
                                </p>
                                <CopyInput
                                    value={`substra add testtuple '{"traintuple_key": "${item.traintuple.key}"}'`}
                                    addNotification={addNotification}
                                    addNotificationMessage="Command copied to clipboard!"
                                    isPrompt
                                />
                            </Fragment>

                        ))
                        || (item.traintuple.status === 'failed' && (
                            <p>This model could not complete its training (no testing possible).</p>
                        ))
                        || (['todo', 'doing'].includes(item.traintuple.status) && (
                            <Fragment>
                                <p>
                                    You can execute the code below to launch a testing task as soon as the training is over.
                                </p>
                                <CopyInput
                                    value={`substra add testtuple '{"traintuple_key": "${item.traintuple.key}"}'`}
                                    addNotification={addNotification}
                                    addNotificationMessage="Command copied to clipboard!"
                                    isPrompt
                                />
                            </Fragment>
                        ))
                    )}
                    </TabPanel>
                </Tabs>
            </Fragment>
);
    }
}

ModelTabs.propTypes = {
    item: PropTypes.shape(),
    addNotification: PropTypes.func,
    downloadFile: PropTypes.func,
};

ModelTabs.defaultProps = {
    item: null,
    addNotification: noop,
    downloadFile: noop,
};

export default ModelTabs;
