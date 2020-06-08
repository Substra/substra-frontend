import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {noop} from 'lodash';
import {
    CodeSample,
    Tabs,
    TabPanel,
    TabList,
} from '@substrafoundation/substra-ui';

import Tab from '../../../../../../common/components/detail/components/tabs';

import TesttupleSummary from '../testtupleSummary';

const tupleFilename = {
    standard: 'traintuple.json',
    composite: 'composite_traintuple.json',
    aggregate: 'aggregatetuple.json',
};

const tupleTabTitle = {
    standard: 'Traintuple/Model',
    composite: 'Composite traintuple/Head model/Trunk model',
    aggregate: 'Aggregatetuple/Model',
};

class ModelTabs extends Component {
    state = {
        tabIndex: 0,
    };

    setTabIndex = (tabIndex) => {
        this.setState({tabIndex});
    };

    render() {
        const {item, addNotification} = this.props;
        const {tabIndex} = this.state;

        // do not display the "type" key in the traintuple that's been inserted for the frontend's internal use
        const cleanTraintuple = item && item.traintuple && {...item.traintuple};
        if (cleanTraintuple) {
            delete cleanTraintuple.type;
        }

        const tupleType = item && item.traintuple && item.traintuple.type;
        const testtuples = [
            // The API returns an empty testtuple if there is no "certified" testtuple.
            // We therefore have to check for a key to know if there is an actual testtuple.
            ...(item.testtuple && item.testtuple.key ? [item.testtuple] : []),
            ...(item.nonCertifiedTesttuples ? item.nonCertifiedTesttuples : []),
        ];

        return (
            <>
                <Tabs
                    selectedIndex={tabIndex}
                    onSelect={this.setTabIndex}
                >
                    <TabList>
                        <Tab>{tupleTabTitle[tupleType]}</Tab>
                        <Tab>Testtuple(s)</Tab>
                    </TabList>
                    <TabPanel>
                        {['standard', 'composite'].includes(tupleType) && item && item.traintuple && item.traintuple.status === 'done' && (
                        <p>
                            Model successfully trained.
                        </p>
                    )}
                        <CodeSample
                            filename={tupleFilename[tupleType]}
                            language="json"
                            codeString={JSON.stringify(cleanTraintuple, null, 2)}
                        />
                    </TabPanel>
                    <TabPanel>
                        {!testtuples.length && (
                            <p>
                                This model has not been tested.
                            </p>
                        )}
                        {testtuples.map((testtuple) => (
                            <TesttupleSummary
                                key={testtuple.key}
                                testtuple={testtuple}
                                addNotification={addNotification}
                            />
                        ))}
                    </TabPanel>
                </Tabs>
            </>
        );
    }
}

ModelTabs.propTypes = {
    item: PropTypes.shape(),
    addNotification: PropTypes.func,
};

ModelTabs.defaultProps = {
    item: null,
    addNotification: noop,
};

export default ModelTabs;
