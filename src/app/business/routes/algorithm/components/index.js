import React from 'react';
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


const Algorithm = () => (
    <div>
        <List className={list} model="algorithm" actions={actions} />
        <Detail className={detail} model="algorithm" actions={actions} />
    </div>
);


export default Algorithm;
