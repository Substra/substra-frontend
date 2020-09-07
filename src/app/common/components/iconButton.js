import React from 'react';
import {css} from 'emotion';
import PropTypes from '../../utils/propTypes';
import {ice} from '../../../../assets/css/variables/colors';

const roundButton = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    border: 1px solid ${ice};
    padding: 0;
    background: none;
    cursor: pointer;

    &:hover {
        background-color: ${ice};
        transition: background-color 200ms ease-out;
    }
`;

export const RoundButton = ({className, ...props}) => (
    <button
        type="button"
        className={css`${roundButton} ${className}`}
        {...props}
    />
);

RoundButton.propTypes = {
    className: PropTypes.string,
};

RoundButton.defaultProps = {
    className: '',
};

export const IconButton = ({Icon, iconSize, ...props}) => (
    <RoundButton {...props}>
        <Icon width={iconSize} height={iconSize} />
    </RoundButton>
);

IconButton.propTypes = {
    Icon: PropTypes.component.isRequired,
    iconSize: PropTypes.number,
};

IconButton.defaultProps = {
    iconSize: 15,
};
