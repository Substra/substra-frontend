import React from 'react';
import {render, fireEvent} from '@testing-library/react';

import CopyInput from './copyInput';

test('It calls the addNotification method', () => {
    const addNotification = jest.fn();
    const value = 'my value';
    const addNotificationMessage = 'Not the default message';

    const {getByTestId, rerender} = render(
        <CopyInput
            value={value}
            addNotification={addNotification}
        />,
    );
    expect(addNotification).not.toHaveBeenCalled();
    fireEvent.click(getByTestId('button'));
    expect(addNotification).toHaveBeenCalledTimes(1);
    expect(addNotification).toHaveBeenLastCalledWith(value, 'Copied!');

    rerender(
        <CopyInput
            value={value}
            addNotification={addNotification}
            addNotificationMessage={addNotificationMessage}
        />,
    );
    fireEvent.click(getByTestId('button'));
    expect(addNotification).toHaveBeenCalledTimes(2);
    expect(addNotification).toHaveBeenLastCalledWith(value, addNotificationMessage);
});

test('It displays a prompt', () => {
    const {getByText, rerender} = render(<CopyInput isPrompt />);
    expect(getByText('$')).toBeDefined();

    rerender(<CopyInput />);
    expect(() => getByText('$')).toThrow();
});
