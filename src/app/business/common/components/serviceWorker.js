/* global window */

import React, {Component} from 'react';
import styled from '@emotion/styled';
import {css, keyframes} from 'emotion';

const fade = keyframes`
  0% {opacity: 0}
  25% {opacity: 1}
  50% {opacity: 0}
  75% {opacity: 1}
  100% {opacity: 0}
`;

const worker = css`
    position: fixed;
    top: 20px;
    right: 20px;
    width: 10px;
    height: 10px;
    z-index: 1;
    border-radius: 50%;
    display: block;    
    opacity: 0;
    animation: ${fade} 3s;
`;

const Green = styled('span')`
    ${worker};
    background-color: #27e86d;
`;

const Red = styled('span')`
    ${worker};
    background-color: #c30e15;
`;

class ServiceWorker extends Component {
    constructor() {
        super();
        this.update = this.update.bind(this);
    }

    state = {
        status: undefined,
    };

    componentDidMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener('online', this.update);
            window.addEventListener('offline', this.update);
        }
    }

    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('online', this.update);
            window.removeEventListener('offline', this.update);
        }
    }

    update() {
        if (typeof window !== 'undefined') {
            this.setState({status: window.navigator.onLine});
        }
    }

    render() {
        const {status} = this.state;
        return typeof window !== 'undefined' && window.navigator && typeof status !== 'undefined' ? (status ? <Green /> : <Red />) : null;
    }
}

export default ServiceWorker;
