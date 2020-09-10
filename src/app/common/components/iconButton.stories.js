import React from 'react';
import {storiesOf} from '@storybook/react';

import {IconButton} from './iconButton';
import Book from './icons/book';

storiesOf('IconButton', module)
    .add('default', () => <IconButton Icon={Book} />);
