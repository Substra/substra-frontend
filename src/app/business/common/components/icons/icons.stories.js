import React, {Fragment} from 'react';
import {storiesOf} from '@storybook/react';
import {withKnobs, color, number} from '@storybook/addon-knobs/react';

import styled from '@emotion/styled';
import {
    Alert,
    Algo,
    Book,
    Check,
    ClearIcon,
    Clipboard,
    Collapse,
    CopyDrop,
    CopySimple,
    Dataset,
    DownloadDrop,
    DownloadSimple,
    Expand,
    FilterUp,
    Folder,
    Model,
    MoreVertical,
    Permission,
    Search,
    SubstraLogo,
} from './index';
import {slate, tealish} from '../../../../../../assets/css/variables/colors';
import {spacingSmall} from '../../../../../../assets/css/variables/spacing';

const Dl = styled.dl`
    display: grid;
    grid-template-columns: 50px auto;
    grid-gap: ${spacingSmall};
`;

const Dt = styled.dt`
    grid-column: 1;
    width: 50px;
`;

const Dd = styled.dd`
    grid-column: 2;
    margin: 0;
`;

storiesOf('Icons', module)
    .addDecorator(withKnobs)
    .add('default', () => {
        const colorKnob = color('color', slate);
        const secondaryColorKnob = color('secondaryColor', tealish);
        const heightKnob = number('height', 24);
        const widthKnob = number('width', 24);
        return (
            <Fragment>
                <Dl>
                    <Dt>
                        <Alert color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Alert
                    </Dd>
                    <Dt>
                        <Algo color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Algo
                    </Dd>
                    <Dt>
                        <Book color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Book
                    </Dd>
                    <Dt>
                        <Check color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Check
                    </Dd>
                    <Dt>
                        <ClearIcon color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        ClearIcon
                    </Dd>
                    <Dt>
                        <Clipboard color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Clipboard
                    </Dd>
                    <Dt>
                        <Collapse color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Collapse
                    </Dd>
                    <Dt>
                        <CopyDrop color={colorKnob} secondaryColor={secondaryColorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        CopyDrop
                    </Dd>
                    <Dt>
                        <CopySimple color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        CopySimple
                    </Dd>
                    <Dt>
                        <Dataset color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Dataset
                    </Dd>
                    <Dt>
                        <DownloadDrop color={colorKnob} secondaryColor={secondaryColorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        DownloadDrop
                    </Dd>
                    <Dt>
                        <DownloadSimple color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        DownloadSimple
                    </Dd>
                    <Dt>
                        <Expand color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Expand
                    </Dd>
                    <Dt>
                        <FilterUp color={colorKnob} secondaryColor={secondaryColorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        FilterUp
                    </Dd>
                    <Dt>
                        <Folder color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Folder
                    </Dd>
                    <Dt>
                        <Model color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Model
                    </Dd>
                    <Dt>
                        <MoreVertical color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        MoreVertical
                    </Dd>
                    <Dt>
                        <Permission color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Permission
                    </Dd>
                    <Dt>
                        <Search color={colorKnob} height={heightKnob} width={widthKnob} />
                    </Dt>
                    <Dd>
                        Search
                    </Dd>
                </Dl>
            </Fragment>
        );
    })
    .add('logos', () => (
        <Fragment>
            <div>
                <OwkestraLogo width={200} />
            </div>
            <div>
                <SubstraLogo width={200} />
            </div>
        </Fragment>
    ));
