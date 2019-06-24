import React from 'react';
import {css} from 'emotion';
import {
    Tabs,
    TabList,
    Tab,
    TabPanel,
    tabTemplate,
} from '@substrafoundation/substra-ui';
import {primaryAccent} from '../../../../../../../assets/css/variables/colors';

const colorOverride = css`
    ${tabTemplate};
    &.selected {
        color: ${primaryAccent}
    }
`;

const TabSUI = props => <Tab className={colorOverride} {...props} />;
TabSUI.tabsRole = 'Tab';

export {
    Tabs,
    TabList,
    TabPanel,
    TabSUI as Tab,
};
