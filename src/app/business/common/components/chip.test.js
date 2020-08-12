import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import {
    ChipActions, ChipButton, ChipTitle, ChipWrapper,
} from './chip';
import Clear from './icons/clear';

test('A function can be called by the button', () => {
    const mock = jest.fn();

    const {getByTestId} = render(
        <ChipWrapper>
            <ChipTitle>objective:key:1cdafbb018dd195690111d74916b76c9</ChipTitle>
            <ChipActions>
                <ChipButton onClick={mock} data-testid="button" Icon={Clear} iconSize={14} iconColor="#E0E0E0" />
            </ChipActions>
        </ChipWrapper>,
    );
    expect(mock).not.toHaveBeenCalled();
    fireEvent.click(getByTestId('button'));
    expect(mock).toHaveBeenCalledTimes(1);
});
