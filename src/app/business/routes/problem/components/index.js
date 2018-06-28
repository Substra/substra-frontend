import React, {Component} from 'react';
import styled, {css} from 'react-emotion';

import List from './list';
import Detail from './detail';

const middle = css`
    display: inline-block;
    vertical-align: top;
`;

const list = css`
    ${middle};
    width: 80%;
    overflow-x: auto;
`;

const detail = css`
    ${middle};
    width: 18%;
    margin-left: 2%;
    overflow-x: auto;
`;


class Problem extends Component {
    render() {
        return (<div>
            <List className={list}/>
            <Detail className={detail}>detail</Detail>
        </div>)
    }
}


export default Problem;
