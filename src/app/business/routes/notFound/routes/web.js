import React from 'react';
import universal from 'react-universal-component';
import {PulseLoader} from 'react-spinners';

import {coolBlue} from '../../../../../../assets/css/variables';

// need to pass different path for generating different chunks
// https://github.com/faceyspacey/babel-plugin-universal-import#caveat
const Universal = universal(import('../../notFound/components'), {
    loading: <PulseLoader size={6} color={coolBlue} />,
    ignoreBabelRename: true,
});

export default Universal;
