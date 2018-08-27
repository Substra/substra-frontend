import React from 'react';
import styled, {css} from 'react-emotion';

import List from './list';
import Detail from '../../../common/components/detail';
import actions from '../actions';

const middle = css`
    display: inline-block;
    vertical-align: top;
`;

const list = css`
    ${middle};
    width: 40%;
    overflow-x: auto;
    border-right: 1px solid #ccc;
`;

const detail = css`
    ${middle};
    width: 59%;
    overflow-x: auto;
`;

const Content = styled('div')`
    margin: 0 20px;
`;

const Model = () => (
    <Content>
        <List className={list} model="model" actions={actions} />
        <Detail className={detail} model="model" actions={actions} />
    </Content>
);


export default Model;
