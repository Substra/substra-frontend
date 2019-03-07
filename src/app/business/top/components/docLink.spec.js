import React from 'react';
import {shallow} from 'enzyme';
import {describe, it} from 'mocha';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {DocLink} from './docLink';

chai.use(sinonChai);

describe('DocLink', () => {
    it('pushes an event to google analytics when clicked', () => {
        const logDoc = sinon.spy();
        const wrapper = shallow(<DocLink logDoc={logDoc} />);
        expect(logDoc).to.not.have.been.called;
        wrapper.find('a').simulate('click');
        expect(logDoc).to.have.been.calledOnce;
    });
});
