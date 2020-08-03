import React, {Component} from 'react';
import styled from '@emotion/styled';
import {css} from 'emotion';
import {noop} from 'lodash';

import {CopySimple, Check} from 'icons';
import PropTypes from '../../../../utils/propTypes';
import {IconButton} from './iconButton';
import {ice, tealish} from '../../../../../assets/css/variables/colors';
import {fontNormalMonospace, monospaceFamily} from '../../../../../assets/css/variables/font';
import {spacingSmall} from '../../../../../assets/css/variables/spacing';


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

const DefaultSuccessIcon = (props) => <Check color={tealish} {...props} />;

class CopyInput extends Component {
    state = {
        clicked: false,
    };

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
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

    icon = () => {
        const {value, CopyIcon, SuccessIcon} = this.props;
        const clicked = this.state.clicked;
        const hasChanged = value !== this.previousValue;
        if (hasChanged) {
            clearTimeout(this.timeout);
        }
        this.previousValue = value;

        const copySimple = css`
            opacity: ${!hasChanged && clicked ? 0 : 1};
            ${!hasChanged && 'transition: opacity 200ms ease-out;'}
        `;

        const check = css`
            position: absolute;
            opacity: ${!hasChanged && clicked ? 1 : 0};
            ${!hasChanged && 'transition: opacity 200ms ease-out;'}
        `;

        return ({width, height}) => (
            <>
                <CopyIcon
                    width={width}
                    height={height}
                    className={copySimple}
                />
                <SuccessIcon
                    width={width}
                    height={height}
                    className={check}
                />
            </>
        );
    };

    render() {
        const {value, isPrompt} = this.props;
        return (
            <Wrapper>
                {isPrompt && <Prompt />}
                <Input
                    value={value}
                    isPrompt={isPrompt}
                    readOnly
                    onClick={this.select}
                    ref={this.inputRef}
                    data-testid="input"
                />
                <IconButton
                    Icon={this.icon()}
                    onClick={this.copy}
                    className={button}
                    data-testid="button"
                />
            </Wrapper>
        );
    }
}

CopyInput.propTypes = {
    value: PropTypes.string,
    isPrompt: PropTypes.bool,
    addNotification: PropTypes.func,
    addNotificationMessage: PropTypes.string,
    CopyIcon: PropTypes.component,
    SuccessIcon: PropTypes.component,
};

CopyInput.defaultProps = {
    value: '',
    isPrompt: false,
    addNotification: noop,
    addNotificationMessage: 'Copied!',
    CopyIcon: CopySimple,
    SuccessIcon: DefaultSuccessIcon,
};

export default CopyInput;
