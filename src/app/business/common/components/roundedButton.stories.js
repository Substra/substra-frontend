import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {RoundedButton} from './roundedButton';
import Book from './icons/book';

const onClick = action('onClick');

storiesOf('RoundedButton', module)
    .add('default', () => (
        <>
            <RoundedButton onClick={onClick}>
                Text only
            </RoundedButton>
            <RoundedButton onClick={onClick} Icon={Book}>
                Icon + text
            </RoundedButton>
        </>
    ))
    .add('disabled', () => (
        <>
            <RoundedButton onClick={onClick} disabled>
                Text only
            </RoundedButton>
            <RoundedButton onClick={onClick} Icon={Book} disabled>
                Icon + text
            </RoundedButton>
        </>
    ))
    .add('icon colors', () => (
        <>
            <RoundedButton
                onClick={onClick}
                iconColor="blue"
                iconColorDisabled="red"
                Icon={Book}
            >
                Normal
            </RoundedButton>
            <RoundedButton
                onClick={onClick}
                iconColor="blue"
                iconColorDisabled="red"
                Icon={Book}
                disabled
            >
                Disabled
            </RoundedButton>
        </>
    ));
