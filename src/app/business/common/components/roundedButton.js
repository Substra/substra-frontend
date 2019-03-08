import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import styled from '@emotion/styled';
import {ice, slate, blueGrey} from '../../../../../assets/css/variables/colors';
import {spacingNormal, spacingExtraSmall} from '../../../../../assets/css/variables/spacing';

const Button = styled.button`
    display: inline-flex;
    color: ${slate};
    align-items: center;
    justify-content: center;
    height: 30px;
    line-height: 28px;
    border-radius: 15px;
    border: 1px solid ${ice};
    padding: 0 ${spacingNormal};
    background: none;
    cursor: pointer;
    
    &:not(:disabled):hover {
        background-color: ${ice};
        transition: background-color 200ms ease-out;
    }
    
    &:disabled {
        color: ${blueGrey}
    }
`;

const RoundedButton = ({
disabled, Icon, children, ...props
}) => (
    <Button disabled={disabled} {...props}>
        {Icon && (
            <Icon
                width={15}
                height={15}
                color={disabled ? blueGrey : slate}
                className={css`margin-right: ${spacingExtraSmall};`}
            />
)}
        {children}
    </Button>
);

RoundedButton.propTypes = {
    disabled: PropTypes.bool,
    Icon: PropTypes.func,
    children: PropTypes.node,
};


RoundedButton.defaultProps = {
    disabled: false,
    Icon: null,
    children: null,
};

export default RoundedButton;
