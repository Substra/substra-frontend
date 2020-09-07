import {storiesOf} from '@storybook/react';
import React from 'react';
import {css} from 'emotion';
import {color, withKnobs} from '@storybook/addon-knobs';
import {
    TabList,
    Tab,
    Tabs,
    TabPanel,
    cssTabTemplate,
} from './tabs';
import {gold} from '../../../../assets/css/variables/colors';

storiesOf('Tabs', module)
    .addDecorator(withKnobs)
    .add('default', () => (
        <Tabs>
            <TabList>
                <Tab>Description</Tab>
                <Tab>Metrics</Tab>
            </TabList>
            <TabPanel>
                <p>First tab's content</p>
            </TabPanel>
            <TabPanel>
                <p>Second tab's content</p>
            </TabPanel>
        </Tabs>
    ))
    .add('color override', () => {
        const checkColor = color('Color: ', gold);
        const tabStyle = css`
            ${cssTabTemplate};
            &.selected {
                color: ${checkColor};
            }
        `;
        const MyTab = (props) => <Tab className={tabStyle} {...props} />;
        MyTab.tabsRole = 'Tab';
        return (
            <Tabs>
                <TabList>
                    <MyTab>Description</MyTab>
                    <MyTab>Metrics</MyTab>
                </TabList>
                <TabPanel>
                    <p>First tab's content</p>
                </TabPanel>
                <TabPanel>
                    <p>Second tab's content</p>
                </TabPanel>
            </Tabs>
        );
    })
    .add('disabled', () => (
        <Tabs>
            <TabList>
                <Tab>Description</Tab>
                <Tab disabled>Metrics</Tab>
            </TabList>
            <TabPanel>
                <p>First tab's content</p>
            </TabPanel>
            <TabPanel>
                <p>Second tab's content</p>
            </TabPanel>
        </Tabs>
    ));
