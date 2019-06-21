import React from 'react';
import {css} from 'emotion';
import {
    Tabs,
    TabList,
    Tab,
    TabPanel,
} from '@substrafoundation/substra-ui';
import {
    blueGrey,
    ice,
    primaryAccent,
    white,
} from '../../../../../../../assets/css/variables/colors';
import {spacingNormal, spacingSmall} from '../../../../../../../assets/css/variables/spacing';
// I had to copy "tab" in this file, the style wasn't correct when importing it from Substra-UI

const tab = css`
    padding: ${spacingSmall} ${spacingNormal};
    border: 1px solid transparent;
    cursor: pointer;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    margin-bottom: -1px;

    &.selected {
        border-color: ${ice} ${ice} ${white} ${ice};
        color: ${primaryAccent};
    }

    &.disabled {
        cursor: not-allowed;
        color: ${blueGrey};
    }
`;

const TabSUI = props => <Tab className={tab} {...props} />;
TabSUI.tabsRole = 'Tab';

export {
    Tabs,
    TabList,
    TabPanel,
    TabSUI as Tab,
};
