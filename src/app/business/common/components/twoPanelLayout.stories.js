import React from 'react';
import {storiesOf} from '@storybook/react';

import TwoPanelLayout from './twoPanelLayout';
import {PanelContent, PanelTop, PanelWrapper} from './panel';

storiesOf('TwoPanelsLayout', module)
    .add('single panel', () => (
        <TwoPanelLayout
            leftPanelContent="Left panel"
        />
    ))
    .add('two panels', () => (
        <TwoPanelLayout
            leftPanelContent="Left panel"
            rightPanelContent="Right panel"
        />
    ))
    .add('two panels with proper style', () => {
        const panelWithStyle = (
            <PanelWrapper>
                <PanelTop>Panel top</PanelTop>
                <PanelContent>Panel content</PanelContent>
            </PanelWrapper>
        );
        return (
            <TwoPanelLayout
                leftPanelContent={panelWithStyle}
                rightPanelContent={panelWithStyle}
            />
        );
    });
