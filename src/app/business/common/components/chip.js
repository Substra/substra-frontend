import React from 'react';
import styled from '@emotion/styled';
import {ClearIcon} from 'icons';
import {spacingSmall} from '../../../../../assets/css/variables/spacing';
import PropTypes from '../../../../utils/propTypes';
import {fontLarge} from '../../../../../assets/css/variables/font';
import {darkSkyBlue} from '../../../../../assets/css/variables/colors';

export const chipBackgroundColor = '#E0E0E0';

export const ChipWrapper = styled('span')`
    background-color: ${chipBackgroundColor};
    border-radius: 30px;
    color: white;
    display: inline-flex;
    vertical-align: middle;
    margin: 3px 3px;
`;

export const ChipTitle = styled('div')`
    color: black;
    margin: auto;
    margin-left: ${spacingSmall};
    font-size: ${fontLarge};
`;

export const ChipActions = styled('div')`
    font-size: ${fontLarge};
`;

export const ChipButtonStyle = styled.button`
    display: inline-flex;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 15px;
    padding: 0;
    border: 1px;
    background-color: darkgray;
    cursor: pointer;
    outline: none;
    margin: 6px 6px; // define the internal margin of the chip
    
    &:hover {
        background-color: gray;
        transition: background-color 200ms ease-out;
    }
    &:focus {
        box-shadow: 0 0 3pt 3pt ${darkSkyBlue};
    }
`;
const DefaultIcon = (props) => <ClearIcon color={chipBackgroundColor} {...props} />;

export const ChipButton = ({
Icon, iconSize, ...props
}) => (
    <ChipButtonStyle {...props}>
        <Icon width={iconSize} height={iconSize} />
    </ChipButtonStyle>
);


ChipButton.propTypes = {
    Icon: PropTypes.component,
    iconSize: PropTypes.number,
};

ChipButton.defaultProps = {
    Icon: DefaultIcon,
    iconSize: 15,
};
