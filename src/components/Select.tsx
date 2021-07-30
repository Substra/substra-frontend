/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { RiArrowDownSLine } from 'react-icons/ri';

import { Colors, Spaces } from '@/assets/theme';

const SelectContainer = styled.div`
    position: relative;
`;

const HtmlSelect = styled.select`
    width: 100%;
    height: 100%;
    opacity: 0;
`;

const SelectedValue = styled.span`
    position: absolute;
    pointer-events: none;
    top: ${Spaces.small};
    left: ${Spaces.medium};
    color: ${Colors.lightContent};
    font-size: 14px;
`;

const arrowDownIcon = css`
    position: absolute;
    top: ${Spaces.extraSmall};
    right: ${Spaces.small};
    width: 24px;
    height: 24px;
    color: ${Colors.lightContent};
    pointer-events: none;
`;

interface SelectProps {
    options: {
        value: string;
        label: string;
    }[];
    value: string;
    onChange: (value: string) => void;
}

const Select = ({
    options,
    value,
    onChange,
    ...props
}: SelectProps): JSX.Element => {
    const selectedOption = options.find((option) => option.value === value);

    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    return (
        <SelectContainer {...props}>
            {options.length > 1 && (
                <HtmlSelect value={value} onChange={handleOnChange}>
                    {options.map(({ label, value }) => (
                        <option value={value} key={value}>
                            {label}
                        </option>
                    ))}
                </HtmlSelect>
            )}
            <SelectedValue>
                {selectedOption ? selectedOption.label : ''}
            </SelectedValue>
            {options.length > 1 && (
                <RiArrowDownSLine css={arrowDownIcon} aria-hidden={true} />
            )}
        </SelectContainer>
    );
};
export default Select;
