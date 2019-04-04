import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {css} from 'emotion';
import {noop} from 'lodash';

import CopySimple from '../../../svg/copy-simple';
import Check from '../../../svg/check';
import IconButton from '../../iconButton';
import {ice, darkSkyBlue} from '../../../../../../../assets/css/variables/colors';
import {fontNormalMonospace, monospaceFamily} from '../../../../../../../assets/css/variables/font';
import {spacingSmall} from '../../../../../../../assets/css/variables/spacing';


const Wrapper = styled('div')`
    position: relative;
`;

const Input = styled('input')`
    width: 100%;
    background-color: transparent;
    color: inherit;
    font-family: ${monospaceFamily};
    font-size: ${fontNormalMonospace};
    text-overflow: ellipsis;
    border: 1px solid ${ice};
    height: 30px;
    border-radius: 15px;
    line-height: 28px;
    padding-left: ${({isPrompt}) => isPrompt ? `calc(${spacingSmall} + 1em)` : spacingSmall};
    padding-right: 35px;
`;

const button = css`
    position: absolute;
    top: 0;
    right: 0;
`;

const prompt = css`
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    line-height: 30px;
    padding-left: ${spacingSmall};
    pointer-events: none;
`;

const Prompt = () => <div className={prompt}>$</div>;


class CopyInput extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            clicked: false,
        };
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    copy = () => {
        const {value, addNotification, addNotificationMessage} = this.props;
        addNotification(value, addNotificationMessage);
        // animate icon
        this.setState({clicked: true});
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.setState({clicked: false});
        }, 2000);
    };

    select = () => {
        this.inputRef.current.select();
    };

    iconStyles = () => {
        const clicked = this.state.clicked;
        const hasChanged = this.props.value !== this.previousValue;
        if (hasChanged) {
            clearTimeout(this.timeout);
        }
        this.previousValue = this.props.value;

        return {
            copySimple: css`
                opacity: ${!hasChanged && clicked ? 0 : 1};
                ${!hasChanged && 'transition: opacity 200ms ease-out;'}
            `,
            check: css`
                position: absolute;
                opacity: ${!hasChanged && clicked ? 1 : 0};
                ${!hasChanged && 'transition: opacity 200ms ease-out;'}
            `,
        };
    };

    render() {
        const {value, isPrompt} = this.props;
        const {copySimple, check} = this.iconStyles();
        return (
            <Wrapper>
                {isPrompt && <Prompt />}
                <Input
                    value={value}
                    isPrompt={isPrompt}
                    readOnly
                    onClick={this.select}
                    ref={this.inputRef}
                />
                <IconButton
                    onClick={this.copy}
                    className={button}
                >
                    <CopySimple width={15} height={15} className={copySimple} />
                    <Check width={15} height={15} color={darkSkyBlue} className={check} />
                </IconButton>
            </Wrapper>
        );
    }
}

CopyInput.propTypes = {
    value: PropTypes.string,
    isPrompt: PropTypes.bool,
    addNotification: PropTypes.func,
    addNotificationMessage: PropTypes.string,
};

CopyInput.defaultProps = {
    value: '',
    isPrompt: false,
    addNotification: noop,
    addNotificationMessage: 'Copied!',
};

export default CopyInput;
