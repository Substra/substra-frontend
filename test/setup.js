import {toHaveStyle} from '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

expect.extend({toHaveStyle});

global.Blob = (content, options) => ({content, options});
