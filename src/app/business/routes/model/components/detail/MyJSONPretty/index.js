import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import {def} from './themes';

const RecursiveKeyValue = ({parent, value, theme, padding, deep}) => {
    // easy types
    if (value === null) {
        return (
            <span style={{color: theme.value.null}}>
                null
            </span>);
    }
    if (typeof value === 'string') {
        return (
            <span style={{color: theme.valueQuotes}}>
                "
                <span style={{color: theme.value.string}}>
                    {value}
                </span>
                "
            </span>);
    }
    if (typeof value === 'number') {
        return (
            <span style={{color: theme.value.number}}>
                {value}
            </span>);
    }
    if (typeof value === 'boolean') {
        return (
            <span style={{color: theme.value.boolean}}>
                {value ? 'true' : 'false'}
            </span>);
    }

    // complex nested
    deep += 1;

    // array
    if (Array.isArray(value)) {
        return (
            <Fragment>
                <span style={{color: theme.bracket}}>
                    {'\u005B'}
                </span>
                <div>
                    {value.map((o, i) => {
                        return <div
                            style={{color: theme.valueQuotes}}
                            key={`${parent}-${o}-${i}`}
                        >
                            {Array(deep * padding + 1).join('\u00A0')}
                            <RecursiveKeyValue parent={parent} value={o} theme={theme} padding={padding} deep={deep}/>
                            {i === value.length - 1 ? '' : (
                                <span style={{color: theme.comma}}>
                                ,
                                </span>
                            )}
                        </div>})
                    }
                </div>
                <span style={{color: theme.bracket}}>
                        {Array((deep - 1) * padding + 1).join('\u00A0')}
                        {'\u005D'}
                </span>
            </Fragment>);
    }

    // object
    if (typeof value === 'object') {
        const keys = Object.keys(value),
            l = keys.length;

        return (
            <Fragment>
                <span style={{color: theme.brace}}>
                    {'\u007B'}
                </span>
                <div>
                    {keys.map((o, i) => {
                        return <div key={`${parent}-${o}-${i}-${deep}`}>
                            <span>
                                {Array(deep * padding + 1).join('\u00A0')}
                            </span>
                            <span style={{color: theme.keyQuotes}}>
                                    "
                                    <span style={{color: theme.key}}>
                                        {o}
                                    </span>
                                    "
                                    <span style={{color: theme.colon}}>
                                        :
                                    </span>
                                {'\u00A0'}
                                </span>
                            <RecursiveKeyValue parent={o} value={value[o]} theme={theme} padding={padding} deep={deep}/>
                            {i === l - 1
                                ? ''
                                : (
                                    <span style={{color: theme.comma}}>
                                    ,
                                    </span>)
                            }
                        </div>})
                    }
                </div>
                <span style={{color: theme.brace}}>
                    {Array((deep - 1) * padding + 1).join('\u00A0')}
                    {'\u007D'}
                </span>
            </Fragment>);
    }

    return value;
};

RecursiveKeyValue.defaultProps = {
    json: null,
    theme: def,
    padding: 2,
    deep: 0,
};


const JSONPretty = ({json, theme, padding}) => {
    // recursive Component
    return (
        <pre style={{overflow: 'auto', backgroundColor: theme.background}}>
            <RecursiveKeyValue value={json} theme={theme} padding={padding} parent="root"/>
        </pre>
    );
};

JSONPretty.defaultProps = {
    json: null,
    theme: def,
    padding: 2,
};

JSONPretty.propTypes = {
    json: PropTypes.shape({}),
    theme: PropTypes.shape({}),
    padding: PropTypes.number,
};

export default JSONPretty;
