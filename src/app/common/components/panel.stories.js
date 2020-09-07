import React from 'react';
import {storiesOf} from '@storybook/react';

import {PanelContent, PanelTop, PanelWrapper} from './panel';

storiesOf('Panel', module)
    .add('default', () => (
        <PanelWrapper>
            <PanelTop>Top</PanelTop>
            <PanelContent>Content</PanelContent>
        </PanelWrapper>
    ));
