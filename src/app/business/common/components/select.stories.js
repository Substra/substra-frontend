import {storiesOf} from '@storybook/react';
import React from 'react';
import Select from './select';

storiesOf('Select', module)
    .add('default', () => (
        <Select>
            <option value="option1">NAME (A-Z)</option>
            <option value="option2">NAME (Z-A)</option>
        </Select>
    ));
