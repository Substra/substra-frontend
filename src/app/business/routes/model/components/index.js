import React from 'react';
import {css} from 'react-emotion';

import List from './list';
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


const Model = () => (
    <div>
        <List className={list} model="model" actions={actions} />
        <Detail className={detail} model="model" actions={actions} />
    </div>
);


export default Model;
