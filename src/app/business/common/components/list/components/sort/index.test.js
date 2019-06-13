import React from 'react';
import {render, fireEvent} from '@testing-library/react';

import Sort from './index';

const options = [
    {label: 'Label A', value: {by: 'by A', direction: 'direction A'}},
    {label: 'Label B', value: {by: 'by B', direction: 'direction B'}},
];

test('It calls setOrder with new selected value', () => {
    const setOrder = jest.fn();
    const {getByTestId} = render(<Sort options={options} setOrder={setOrder} location={{}} />);

    expect(setOrder).not.toHaveBeenCalled();
    fireEvent.change(getByTestId('select'), {target: {value: options[0].label}});
    expect(setOrder).toHaveBeenLastCalledWith(options[0].value);

    fireEvent.change(getByTestId('select'), {target: {value: options[1].label}});
    expect(setOrder).toHaveBeenLastCalledWith(options[1].value);
});

test('It selects the default value', () => {
    const setOrder = jest.fn();
    const {getByTestId, rerender} = render(<Sort options={options} setOrder={setOrder} location={{}} />);
    expect(getByTestId('select').value).toEqual(options[0].label);

    rerender(<Sort options={options} setOrder={setOrder} location={{}} order={options[1].value} />);
    expect(getByTestId('select').value).toEqual(options[1].label);

    rerender(<Sort options={options} setOrder={setOrder} location={{}} order={options[0].value} />);
    expect(getByTestId('select').value).toEqual(options[0].label);
});

test('It syncs with the location at mount', () => {
    const setOrder = jest.fn();

    render(<Sort
        options={options}
        setOrder={setOrder}
        location={{query: {by: 'by A', direction: 'direction A'}}}
    />);
    expect(setOrder).toHaveBeenCalledWith({by: 'by A', direction: 'direction A'});

    setOrder.mockClear();
    render(<Sort
        options={options}
        setOrder={setOrder}
        location={{query: {by: 'by B', direction: 'direction B'}}}
    />);
    expect(setOrder).toHaveBeenCalledWith({by: 'by B', direction: 'direction B'});

    setOrder.mockClear();
    render(<Sort options={options} setOrder={setOrder} />);
    expect(setOrder).not.toHaveBeenCalled();
});
