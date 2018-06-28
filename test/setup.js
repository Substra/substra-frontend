/** Setup file for jest */
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import serializer from 'jest-glamor-react'
import {sheet} from 'emotion';


// Enzyme needs an adapter configure
configure({adapter: new Adapter()});

// Add css class to snapshots
/** Change the class name to emotion-xxx instead of glamor-xxx */
function replaceClassNames(className, index) {
    return `emotion-${index}`
}

expect.addSnapshotSerializer(serializer(sheet, replaceClassNames));

