import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import {
    TabList,
    Tab,
    Tabs,
    TabPanel,
} from './tabs';
import {tealish} from '../../../../../assets/css/variables/colors';

test('Tab\'s color changes & the description is updated', () => {
    const {getByTestId} = render(<Tabs>
        <TabList>
            <Tab data-testid="title_1">Description</Tab>
            <Tab data-testid="title_2">Metrics</Tab>
        </TabList>
        <TabPanel>
            <p data-testid="desc_1">First tab's content</p>
        </TabPanel>
        <TabPanel>
            <p data-testid="desc_2">Second tab's content</p>
        </TabPanel>
    </Tabs>);

    expect(getByTestId('desc_1')).toBeDefined();
    expect(() => getByTestId('desc_2')).toThrow();

    expect(getByTestId('title_1')).toHaveStyle(`color: ${tealish}`);
    expect(getByTestId('title_2')).not.toHaveStyle(`color: ${tealish}`);

    fireEvent.click(getByTestId('title_2'));

    expect(() => getByTestId('desc_1')).toThrow();
    expect(getByTestId('desc_2')).toBeDefined();

    expect(getByTestId('title_1')).not.toHaveStyle(`color: ${tealish}`);
    expect(getByTestId('title_2')).toHaveStyle(`color: ${tealish}`);
});
test('It should have a disabled state', () => {
    const {getByTestId} = render(<Tabs>
        <TabList>
            <Tab data-testid="title_1">Description</Tab>
            <Tab data-testid="title_2" disabled>Metrics</Tab>
        </TabList>
        <TabPanel>
            <p data-testid="desc_1">First tab's content</p>
        </TabPanel>
        <TabPanel>
            <p data-testid="desc_2">Second tab's content</p>
        </TabPanel>
    </Tabs>);

    expect(getByTestId('desc_1')).toBeDefined();
    expect(() => getByTestId('desc_2')).toThrow();

    expect(getByTestId('title_1')).toHaveStyle(`color: ${tealish}`);
    expect(getByTestId('title_2')).not.toHaveStyle(`color: ${tealish}`);

    fireEvent.click(getByTestId('title_2'));

    expect(getByTestId('desc_1')).toBeDefined();
    expect(() => getByTestId('desc_2')).toThrow();

    expect(getByTestId('title_1')).toHaveStyle(`color: ${tealish}`);
    expect(getByTestId('title_2')).not.toHaveStyle(`color: ${tealish}`);
});
