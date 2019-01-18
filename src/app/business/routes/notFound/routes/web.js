import React from 'react';
import universal from 'react-universal-component';
import {PulseLoader} from 'react-spinners';


// need to pass different path for generating different chunks
// https://github.com/faceyspacey/babel-plugin-universal-import#caveat
const Universal = universal(import('../../notFound/components'), {
    loading: <PulseLoader size={6} />,
    ignoreBabelRename: true,
});

export default Universal;
