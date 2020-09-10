import React from 'react';
import {configure, addDecorator} from '@storybook/react';
import requireContext from 'require-context.macro';
import GlobalStyles from '../src/app/common/components/globalStyles';

// automatically import all files ending in *.stories.js
const req = requireContext('../src', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

const withGlobalStyles = (cb) => (
  <div id="app-root">
    <GlobalStyles />
    {cb()}
  </div>
);

addDecorator(withGlobalStyles);


configure(loadStories, module);
