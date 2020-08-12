import React from 'react';
import {css} from 'emotion';
import {Tab as ReactTab, TabList as ReactTabList} from 'react-tabs';
import {
    blueGrey, ice, tealish, white,
} from '../../../../../assets/css/variables/colors';
import {spacingNormal, spacingSmall} from '../../../../../assets/css/variables/spacing';

export {Tabs, TabPanel} from 'react-tabs';

const cssTabList = `
    border-bottom: 1px solid ${ice};
    padding: 0;
    margin: ${spacingNormal} 0;
    display: flex;
    list-style: none;
`;

export const cssTabTemplate = `
    padding: ${spacingSmall} ${spacingNormal};
    border: 1px solid transparent;
    cursor: pointer;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    margin-bottom: -1px;

    &.selected {
        border-color: ${ice} ${ice} ${white} ${ice};
        color: ${tealish};
    }

    &.disabled {
        cursor: not-allowed;
        color: ${blueGrey};
    }
`;

const tabList = css`
    ${cssTabList}
`;

const tabTemplate = css`
    ${cssTabTemplate}
`;

export const TabList = (props) => (
    <ReactTabList
        className={tabList}
        {...props}
    />
);
TabList.tabsRole = 'TabList';

export const Tab = (props) => (
    <ReactTab
        className={tabTemplate}
        selectedClassName="selected"
        disabledClassName="disabled"
        {...props}
    />
);
Tab.tabsRole = 'Tab';
