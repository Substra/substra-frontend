import React, {Component} from 'react';
import {css} from 'react-emotion';

import List from '../../../common/components/list';
import Detail from '../../../common/components/detail';
import actions from '../actions';

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
            <List className={list} model="problem" actions={actions}/>
            <Detail className={detail} model="problem" />
        </div>)
    }
}


export default Problem;
