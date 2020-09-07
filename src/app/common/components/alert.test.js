import React from 'react';
import styled from '@emotion/styled';
import {render, fireEvent} from '@testing-library/react';
import {
    alertInlineButton,
    AlertActions,
    alertTitle,
    alertWrapper,
} from './alert';


test('A function can be called by the button', () => {
    const AlertWrapper = styled('div')`
            ${alertWrapper}
        `;
    const AlertTitle = styled('div')`
            ${alertTitle}
        `;
    const AlertInlineButton = styled('button')`
            ${alertInlineButton}
        `;

    const mock = jest.fn();

    const {getByTestId} = render(
        <AlertWrapper>
            <AlertTitle>This model has not been tested yet</AlertTitle>
            <AlertActions>
                <AlertInlineButton data-testid="button" onClick={mock}>learn more</AlertInlineButton>
            </AlertActions>
        </AlertWrapper>,
    );

    expect(mock).not.toHaveBeenCalled();
    fireEvent.click(getByTestId('button'));
    expect(mock).toHaveBeenCalledTimes(1);
});
