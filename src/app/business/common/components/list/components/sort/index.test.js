import React from 'react';
import {render, fireEvent} from '@testing-library/react';

import Sort from './index';

const options = [
    {label: 'Label A', value: {by: 'by A', direction: 'direction A'}},
    {label: 'Label B', value: {by: 'by B', direction: 'direction B'}},
];

const setup = () => {
};

test('It calls setOrder with new selected value', () => {
    const setOrder = jest.fn();
    const {container} = render(<Sort options={options} setOrder={setOrder} location={{}}/>);

    expect(setOrder).not.toHaveBeenCalled();
    fireEvent.change(container.querySelector('select'),  {target: {value: options[0]['value']}});
    expect(setOrder).toHaveBeenLastCalledWith(options[0]['value']);
});

test('It selects the default value', () => {
    const setOrder = jest.fn();
    const {container, rerender} = render(<Sort options={options} setOrder={setOrder} location={{}}/>);
    expect(container.querySelector('select').value).toEqual(options[0].label);

    rerender(<Sort options={options} setOrder={setOrder} location={{}} order={options[1].value}/>);
    expect(container.querySelector('select').value).toEqual(options[1].label);

    rerender(<Sort options={options} setOrder={setOrder} location={{}} order={options[0].value}/>);
    expect(container.querySelector('select').value).toEqual(options[0].label);
});

test('It syncs with the location at mount', () => {
    let setOrder,
        location;

    setOrder = jest.fn();
    location = {query: {by: 'by A', direction: 'direction A'}};
    render(<Sort options={options} setOrder={setOrder} location={location}/>);
    expect(setOrder).toHaveBeenCalledWith({by: 'by A', direction: 'direction A'});

    setOrder = jest.fn();
    location = {};
    render(<Sort options={options} setOrder={setOrder} location={location}/>);
    expect(setOrder).not.toHaveBeenCalled();
});
