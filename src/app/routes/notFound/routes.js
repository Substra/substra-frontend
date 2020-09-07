import React from 'react';
import universal from 'react-universal-component';
import PulseLoader from 'react-spinners/PulseLoader';


// need to pass different path for generating different chunks
// https://github.com/faceyspacey/babel-plugin-universal-import#caveat
const UniversalNotFound = universal(import('./components'), {
    loading: <PulseLoader size={6} />,
    ignoreBabelRename: true,
});

export default UniversalNotFound;
