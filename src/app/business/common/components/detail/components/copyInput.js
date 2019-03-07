import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {css} from 'emotion';
import copy from 'copy-to-clipboard';

import CopySimple from '../../../svg/copy-simple';
import IconButton from '../../iconButton';
import {ice} from '../../../../../../../assets/css/variables/colors';
import {fontNormalMonospace, monospaceFamily} from '../../../../../../../assets/css/variables/font';
import {spacingSmall} from '../../../../../../../assets/css/variables/spacing';


const Wrapper = styled('div')`
    position: relative;
`;

const Input = styled('input')`
    border: none;
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


class CopyInput extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    copy = () => {
        const {value} = this.props;
        copy(value);
        /* todo: add animation (checkmark instead of copy icon) */
    };

    select = () => {
        this.inputRef.current.select();
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
                />
                <IconButton
                    onClick={this.copy}
                    className={button}
                >
                    <CopySimple width={15} height={15} />
                </IconButton>
            </Wrapper>
        );
    }
}

CopyInput.propTypes = {
    value: PropTypes.string,
    isPrompt: PropTypes.bool,
};

CopyInput.defaultProps = {
    value: '',
    isPrompt: false,
};

export default CopyInput;
