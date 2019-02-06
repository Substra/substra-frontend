import React from 'react';
import {mount} from 'enzyme';
import {describe, it} from 'mocha';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import withAnalytics, {
logFunctions, LOG_DOC, LOG_LIST, LOG_DETAIL,
} from './analytics';

chai.use(sinonChai);

describe('withAnalytics', () => {
    const setup = () => {
        const reducer = (state, action) => state;
        const store = createStore(reducer, {});

        const Dummy = () => null;

        logFunctions[LOG_DOC] = sinon.spy(logFunctions[LOG_DOC]);
        logFunctions[LOG_LIST] = sinon.spy(logFunctions[LOG_LIST]);
        logFunctions[LOG_DETAIL] = sinon.spy(logFunctions[LOG_DETAIL]);

        const DummyWithAnalytics = withAnalytics(Dummy, [LOG_DOC, LOG_LIST]);
        return {Dummy, DummyWithAnalytics, store};
    };

    it('injects the correct log functions', () => {
        const {Dummy, DummyWithAnalytics, store} = setup();
        const wrapper = mount(<Provider store={store}><DummyWithAnalytics /></Provider>);
        expect(logFunctions[LOG_DOC]).to.have.been.calledOnce;
        expect(logFunctions[LOG_LIST]).to.have.been.calledOnce;
        expect(logFunctions[LOG_DETAIL]).to.have.not.been.called;
        const logDoc = logFunctions[LOG_DOC].returnValues[0];
        const logList = logFunctions[LOG_LIST].returnValues[0];

        const props = wrapper.find(Dummy).props();

        expect(props.logDoc).to.equals(logDoc);
        expect(props.logList).to.equals(logList);
        expect(props).to.not.have.key('logDetail');
    });

    it('passes through other props', () => {
        const {Dummy, DummyWithAnalytics, store} = setup();
        const wrapper = mount(<Provider store={store}><DummyWithAnalytics toto="toto" /></Provider>);
        const props = wrapper.find(Dummy).props();
        expect(props).to.include.key('toto');
    });
});
