import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {fontLarge} from '../../../../../../../assets/css/variables/font';
import {gold} from '../../../../../../../assets/css/variables/colors';

export const title = css`
    color: ${gold};
    font-weight: bold;
    font-size: ${fontLarge};
`;


const Title = ({item}) => (<div className={title}>{item ? item.name : ''}</div>);

Title.propTypes = {
    item: PropTypes.shape(),
};

Title.defaultProps = {
    item: null,
};

export default Title;
