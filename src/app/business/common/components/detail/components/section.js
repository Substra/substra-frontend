import React from 'react';
import {css} from 'emotion';
import {spacingNormal} from '../../../../../../../assets/css/variables/spacing';

export const section = css`
    margin: ${spacingNormal};
`;

export default (props) => <div className={section} {...props}/>
