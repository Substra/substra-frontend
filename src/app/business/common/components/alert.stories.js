import {storiesOf} from '@storybook/react';
import React from 'react';
import {withKnobs, color} from '@storybook/addon-knobs';
import styled from '@emotion/styled';
import {
    alertInlineButton,
    AlertActions,
    alertTitle,
    alertWrapper,
} from './alert';
import {darkSkyBlue, iceBlueTwo} from '../../../../../assets/css/variables/colors';

storiesOf('Alert', module)
    .addDecorator(withKnobs)
    .add('default', () => {
        const AlertWrapper = styled('div')`
            ${alertWrapper}
        `;
        const AlertTitle = styled('div')`
            ${alertTitle}
        `;
        const AlertInlineButton = styled('button')`
            ${alertInlineButton}
        `;
        return (
            <AlertWrapper>
                <AlertTitle>This model has not been tested yet</AlertTitle>
                <AlertActions>
                    <AlertInlineButton>learn more</AlertInlineButton>
                </AlertActions>
            </AlertWrapper>
        );
    })
    .add('override', () => {
        const pColor = color('Primary color: ', iceBlueTwo);
        const sColor = color('Secondary color: ', darkSkyBlue);
        const AlertWrapper = styled('div')`
            ${alertWrapper};
            background-color: ${pColor};
            border: 1px solid ${sColor};
        `;
        const AlertTitle = styled('div')`
            ${alertTitle};
            color: ${sColor}
        `;
        const AlertInlineButton = styled('button')`
            ${alertInlineButton};
            color: ${sColor}
        `;
        return (
            <AlertWrapper>
                <AlertTitle>This model has not been tested yet</AlertTitle>
                <AlertActions>
                    <AlertInlineButton>learn more</AlertInlineButton>
                </AlertActions>
            </AlertWrapper>
        );
    });
