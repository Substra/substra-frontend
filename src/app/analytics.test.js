import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import withAnalytics, {
    logFunctions, LOG_DOC, LOG_LIST, LOG_DETAIL,
} from './analytics';


const setup = () => {
    const reducer = (state, action) => state;
    const store = createStore(reducer, {});

    const Dummy = jest.fn(() => null);

    logFunctions[LOG_DOC] = jest.fn(logFunctions[LOG_DOC]);
    logFunctions[LOG_LIST] = jest.fn(logFunctions[LOG_LIST]);
    logFunctions[LOG_DETAIL] = jest.fn(logFunctions[LOG_DETAIL]);

    const DummyWithAnalytics = withAnalytics(Dummy, [LOG_DOC, LOG_LIST]);
    return {Dummy, DummyWithAnalytics, store};
};

test('It injects the correct log functions', () => {
    const {Dummy, DummyWithAnalytics, store} = setup();
    render(<Provider store={store}><DummyWithAnalytics /></Provider>);
    expect(logFunctions[LOG_DOC]).toHaveBeenCalledTimes(1);
    expect(logFunctions[LOG_LIST]).toHaveBeenCalledTimes(1);
    expect(logFunctions[LOG_DETAIL]).not.toHaveBeenCalled();
    const logDoc = logFunctions[LOG_DOC].mock.results[0].value;
    const logList = logFunctions[LOG_LIST].mock.results[0].value;

    const props = Dummy.mock.calls[0][0];

    expect(props.logDoc).toBe(logDoc);
    expect(props.logList).toBe(logList);
    expect(props).not.toHaveProperty('logDetail');
});

test('It passes through other props', () => {
    const {Dummy, DummyWithAnalytics, store} = setup();
    render(<Provider store={store}><DummyWithAnalytics toto="toto" /></Provider>);
    const props = Dummy.mock.calls[0][0];
    expect(props).toHaveProperty('toto');
});
