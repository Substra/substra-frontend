import React from 'react';
import {storiesOf} from '@storybook/react';
import {withKnobs, text, boolean} from '@storybook/addon-knobs/react';

import CopyInput from './copyInput';
import Book from './icons/book';
import Model from './icons/model';


storiesOf('CopyInput', module)
    .addDecorator(withKnobs)
    .add('default', () => {
        const value = text('value', 'Lorem ipsum dolor sit amet');
        const addNotificationMessage = text('addNotificationMessage');
        const addNotification = (v, t) => console.log(`value: ${v}\nmessage: ${t}`);
        const isPrompt = boolean('isPrompt', false);

        return (
            <CopyInput
                value={value}
                isPrompt={isPrompt}
                addNotification={addNotification}
                addNotificationMessage={addNotificationMessage}
            />
);
    })
    .add('color override', () => {
        const CopyIcon = (props) => <Model color="yellow" {...props} />;
        const SuccessIcon = (props) => <Book color="red" {...props} />;
        return <CopyInput SuccessIcon={SuccessIcon} CopyIcon={CopyIcon} />;
    });
