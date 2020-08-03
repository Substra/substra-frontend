import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {white} from '../../variables/colors';
import {fontNormal} from '../../variables/font';

const paper = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 6px 24px;
    min-width: 288px;
    max-width: 568px;
    border-radius: 5px;
    box-shadow: 0 4px 8px 1px #bdbdbd;
    background-color: ${white};
`;

const messagePadding = css`
    padding: 8px 0;
    font-size: ${fontNormal};
    line-height: 16px;
`;

function SnackbarContent(props) {
    const {
        message,
        className,
        ...other
    } = props;
    return (
        <div
            className={`${className} ${paper}`}
            {...other}
        >
            <div className={messagePadding}>
                {message}
            </div>
        </div>
    );
}

SnackbarContent.propTypes = {
    /**
     * The CSS class name of the wrapper element.
     */
    className: PropTypes.string,
    /**
     * The message to display.
     */
    message: PropTypes.node,
    key: PropTypes.string,
};

SnackbarContent.defaultProps = {
    className: '',
    message: null,
    key: '',
};

export default SnackbarContent;
