import {describe, it} from 'mocha';
import chai, {expect} from 'chai';
import React from 'react';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Sort from './index';

chai.use(sinonChai);

describe('Sort', () => {
    const options = [
        {label: 'Label A', value: {by: 'by A', direction: 'direction A'}},
        {label: 'Label B', value: {by: 'by B', direction: 'direction B'}},
    ];

    const setup = () => {
        const setOrder = sinon.spy();
        const wrapper = mount(<Sort options={options} setOrder={setOrder} location={{}} />);
        return {wrapper, setOrder, options};
    };

    it('calls setOrder with new selected value', () => {
        const {wrapper, setOrder, options} = setup();

        // select exists and has both options
        expect(wrapper.exists('select')).to.be.true;
        const optionWrappers = wrapper.find('option');
        expect(optionWrappers).to.have.lengthOf(2);
        expect(optionWrappers.at(0).text()).to.equal('Label A');
        expect(optionWrappers.at(1).text()).to.equal('Label B');

        // select is passed to setOrder
        const select = wrapper.find('select');
        select.simulate('change', {target: {value: optionWrappers.get(0).props.value}});
        expect(setOrder).to.have.been.calledOnceWith(options[0].value);
    });

    it('selects the default value', () => {
        const {wrapper, options} = setup();

        expect(wrapper.find('select').props().value).to.equal(options[0].label);

        wrapper.setProps({order: options[1].value});
        expect(wrapper.find('select').props().value).to.equal(options[1].label);

        wrapper.setProps({order: options[0].value});
        expect(wrapper.find('select').props().value).to.equal(options[0].label);
    });

    it('syncs with the location at mount', () => {
        let setOrder,
            location;

        setOrder = sinon.spy();
        location = {query: {by: 'by A', direction: 'direction A'}};
        shallow(<Sort options={options} setOrder={setOrder} location={location} />);
        expect(setOrder).to.have.been.calledOnceWith({by: 'by A', direction: 'direction A'});

        setOrder = sinon.spy();
        location = {};
        shallow(<Sort options={options} setOrder={setOrder} location={location} />);
        expect(setOrder).to.have.not.been.called;
    });
});
