import React from 'react';
import {storiesOf} from '@storybook/react';
import {withKnobs, color} from '@storybook/addon-knobs';
import PropTypes from '../../../../../utils/propTypes';
import withAddNotification from './copyNotification';
import Check from '../icons/check';
import {darkSkyBlue} from '../../../../../../assets/css/variables/colors';

storiesOf('CopyNotification', module)
    .addDecorator(withKnobs)
    .add('default', () => {
        const addNotificationButton = ({addNotification}) => (
            <button type="button" onClick={() => addNotification(Math.random().toString(36).substring(2, 15), Math.random().toString(36).substring(2, 15))}>
                Add notification
            </button>
        );

        addNotificationButton.propTypes = {
            addNotification: PropTypes.func.isRequired,
        };

        const Button = withAddNotification(addNotificationButton);
        return <Button />;
    })
    .add('animation', () => {
        const addNotificationButton = ({addNotification}) => (
            <button type="button" onClick={() => addNotification(Math.random().toString(36).substring(2, 15), Math.random().toString(36).substring(2, 15))}>
                Add notification
            </button>
        );

        addNotificationButton.propTypes = {
            addNotification: PropTypes.func.isRequired,
        };

        const Button = withAddNotification(addNotificationButton);
        const delay = {animation: 300, display: 1000};
        return <Button delay={delay} />;
    })
    .add('color override', () => {
        const checkColor = color('Color: ', darkSkyBlue);
        const addNotificationButton = ({addNotification}) => (
            <button type="button" onClick={() => addNotification('1cdafbb018dd195690111d74916b76c96892d897ec3587c814f287946db446c3', 'Objective\'s key successfully copied to clipboard!')}>
                Add notification
            </button>
        );

        addNotificationButton.propTypes = {
            addNotification: PropTypes.func.isRequired,
        };

        const OwkestraCheck = () => <Check color={checkColor} />;

        const Button = withAddNotification(addNotificationButton, OwkestraCheck);
        return <Button />;
    });
