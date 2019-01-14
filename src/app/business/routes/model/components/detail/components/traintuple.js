import React from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-prettify';
import {atomOneLight} from 'react-json-prettify/dist/themes';
import {slate, tealish} from '../../../../../../../../assets/css/variables';


const owkin = {
    ...atomOneLight,
    keyQuotes: slate,
    valueQuotes: 'rgb(140, 153, 165)',
    key: slate,
    value: {
        ...atomOneLight.value,
        string: 'rgb(140, 153, 165)',
        number: tealish,
    },
};

const Traintuple = ({traintuple}) => <JSONPretty json={traintuple} theme={owkin} />;

Traintuple.defaultProps = {
    traintuple: null,
};

Traintuple.propTypes = {
    traintuple: PropTypes.shape(),
};

export default Traintuple;
