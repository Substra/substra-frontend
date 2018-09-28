import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {css} from 'react-emotion';
import {isArray} from 'lodash';

import {def} from './themes';

const RecursiveKeyValue = ({parent, value, theme, padding, deep}) => {
    // easy types
    if (value === null) {
        return (
            <span className={css`color: ${theme.value.null}`}>
                null
            </span>);
    }
    if (typeof value === 'string') {
        return (
            <span className={css`color: ${theme.valueQuotes}`}>
                "
                <span className={css`color: ${theme.value.string}`}>
                    {value}
                </span>
                "
                </span>);
    }
    if (typeof value === 'number') {
        return (
            <span className={css`color: ${theme.value.number}`}>
                    {value}
                </span>);
    }
    if (typeof value === 'boolean') {
        return (
            <span className={css`color: ${theme.value.boolean}`}>
                    {value ? 'true' : 'false'}
                </span>);
    }

    // complex nested
    deep += 1;

    //array
    if (isArray(value)) {
        return (
            <Fragment>
                <span className={css`color: ${theme.bracket}`}>
                    {'\u005B'}
                </span>
                <div>
                    {value.map((o, i) => {
                        return <div
                            className={css`color: ${theme.valueQuotes}`}
                            key={`${parent}-${o}-${i}`}
                        >
                            {Array(deep * padding + 1).join('\u00A0')}
                            <RecursiveKeyValue parent={parent} value={o} theme={theme} padding={padding} deep={deep}/>
                            {i === value.length - 1 ? '' : (
                                <span className={css`color: ${theme.comma}`}>
                                ,
                                </span>
                            )}
                        </div>})
                    }
                </div>
                <span className={css`color: ${theme.bracket}`}>
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
                <span className={css`color: ${theme.brace}`}>
                    {'\u007B'}
                </span>
                <div>
                    {keys.map((o, i) => {
                        return <div key={`${parent}-${o}-${i}-${deep}`}>
                            <span>
                                {Array(deep * padding + 1).join('\u00A0')}
                            </span>
                            <span className={css`color: ${theme.keyQuotes}`}>
                                    "
                                    <span className={css`color: ${theme.key}`}>
                                        {o}
                                    </span>
                                    "
                                    <span className={css`color: ${theme.colon}`}>
                                        :
                                    </span>
                                {'\u00A0'}
                                </span>
                            <RecursiveKeyValue parent={o} value={value[o]} theme={theme} padding={padding} deep={deep}/>
                            {i === l - 1
                                ? ''
                                : (
                                    <span className={css`color: ${theme.comma}`}>
                                    ,
                                    </span>)
                            }
                        </div>})
                    }
                </div>
                <span className={css`color: ${theme.brace}`}>
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
        <pre className={css`overflow: auto;background-color: ${theme.background}`}>
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
