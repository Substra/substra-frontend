/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { RiFilter2Line, RiFilter2Fill } from 'react-icons/ri';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { Colors, Spaces } from '@/assets/theme';
import CloseButton from './CloseButton';
import Checkbox from './Checkbox';

const Container = styled.div`
    position: relative;
    display: inline-block;
`;

const Toggle = styled.button`
    border: none;
    background: none;
    height: 30px;
    width: 30px;
    border-radius: 15px;
    margin: -15px 0 -15px ${Spaces.medium};
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: ${Colors.primary};
        background: ${Colors.background};
    }
`;

interface FlyOutContainerProps {
    visible: boolean;
}

const FlyOutContainer = styled.div<FlyOutContainerProps>`
    position: absolute;
    top: ${({ visible }) => (visible ? Spaces.large : 0)};
    left: -110px;
    right: ${Spaces.large};
    box-shadow: 0 0 8px ${Colors.border};
    width: 250px;
    border-radius: 16px;
    background-color: white;
    z-index: 1;
    padding: ${Spaces.large};
    font-weight: normal;
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    pointer-events: ${({ visible }) => (visible ? 'initial' : 'none')};
    transition: all 0.1s ease-out;
`;

const FlyOutTitle = styled.div`
    font-size: 12px;
    color: ${Colors.lightContent};
`;

const closeButtonPosition = css`
    position: absolute;
    top: ${Spaces.small};
    right: ${Spaces.small};
`;

const ApplyButton = styled.button`
    display: block;
    width: 100%;
    padding: ${Spaces.small} ${Spaces.medium};
    background-color: ${Colors.primary};
    color: white;
    text-transform: uppercase;
    border: none;
    border-radius: ${Spaces.small};
    margin-top: ${Spaces.large};

    &:disabled {
        opacity: 0.23;
    }
`;

const ClearButton = styled.button`
    display: block;
    padding: ${Spaces.small} ${Spaces.medium};
    margin: ${Spaces.small} auto 0 auto;
    color: ${Colors.primary};
    border: none;
    background: none;

    &:not(:disabled):hover {
        text-decoration: underline;
    }

    &:disabled {
        opacity: 0.23;
    }
`;

const Li = styled.li`
    margin: ${Spaces.large} 0;
    width: 100%;
`;

const Label = styled.label`
    font-size: 15px;
    font-weight: normal;
    color: ${Colors.content};

    input {
        margin-right: ${Spaces.medium};
    }
`;

const primaryIcon = css`
    color: ${Colors.primary};
`;

interface TableFilterProps {
    value: string[];
    setValue: (value: string[]) => void;
    options: string[];
}

const TableFilter = ({
    value,
    setValue,
    options,
}: TableFilterProps): JSX.Element => {
    const [visible, setVisible] = useState(false);
    const [tmpValue, setTmpValue] = useState(value);

    const onOptionChange = (option: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = event.target.checked;
        const inList = tmpValue.includes(option);

        if (checked && !inList) {
            setTmpValue([...tmpValue, option]);
        }

        if (!checked && inList) {
            setTmpValue(tmpValue.filter((v) => v !== option));
        }
    };

    const onToggleClick = () => {
        if (!visible) {
            setTmpValue(value);
        }
        setVisible(!visible);
    };

    const onApplyClick = () => {
        setValue(tmpValue);
        setVisible(false);
    };

    const onClearClick = () => {
        setValue([]);
        setVisible(false);
    };

    const applyDisabled = () => {
        return (
            value.length === tmpValue.length &&
            value.every((v) => tmpValue.includes(v))
        );
    };

    const clearDisabled = () => {
        return !value.length && !tmpValue.length;
    };

    return (
        <Container>
            <Toggle onClick={onToggleClick}>
                {value.length > 0 ? (
                    <RiFilter2Fill css={primaryIcon} />
                ) : (
                    <RiFilter2Line />
                )}
            </Toggle>
            <FlyOutContainer visible={visible} aria-hidden={!visible}>
                <FlyOutTitle>Filter by</FlyOutTitle>
                <CloseButton
                    css={closeButtonPosition}
                    onClick={() => setVisible(false)}
                />
                <ul>
                    {options.map((option) => (
                        <Li key={option}>
                            <Label>
                                <Checkbox
                                    value={option}
                                    checked={tmpValue.includes(option)}
                                    onChange={onOptionChange(option)}
                                />
                                {option}
                            </Label>
                        </Li>
                    ))}
                </ul>
                <ApplyButton onClick={onApplyClick} disabled={applyDisabled()}>
                    Apply
                </ApplyButton>
                <ClearButton onClick={onClearClick} disabled={clearDisabled()}>
                    Clear
                </ClearButton>
            </FlyOutContainer>
        </Container>
    );
};

export default TableFilter;
