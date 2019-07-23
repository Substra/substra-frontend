import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import {DocLink} from './docLink';

test('It pushes an event to google analytics when clicked', () => {
    const logDoc = jest.fn();
    const {getByTestId} = render(<DocLink logDoc={logDoc} />);
    expect(logDoc).not.toHaveBeenCalled();
    fireEvent.click(getByTestId('link'));
    expect(logDoc).toHaveBeenCalled();
});
