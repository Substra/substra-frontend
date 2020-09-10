import {storiesOf} from '@storybook/react';
import React from 'react';
import {
    ChipActions, ChipButton, ChipTitle, ChipWrapper,
} from './chip';

storiesOf('Chip', module)
    .add('default', () => (
        <ChipWrapper>
            <ChipTitle>objective:key:1cdafbb018dd195690111d74916b76c9</ChipTitle>
            <ChipActions>
                <ChipButton iconSize={14} />
            </ChipActions>
        </ChipWrapper>
    ));
