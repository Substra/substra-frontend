import { useState } from 'react';

import Cookies from 'universal-cookie';

export const toBool = (value: string | undefined): boolean | undefined => {
    if (value === undefined) {
        return undefined;
    }

    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }
    throw `Cannot convert value to boolean: ${value}`;
};

const useCookie = <Type>(
    cookieName: string,
    cast: (value: string | undefined) => Type
): [Type, (value: Type) => void] => {
    const cookies = new Cookies();

    // useState is required so that updating cookie is reactive
    const [value, setValue] = useState(() => cast(cookies.get(cookieName)));

    const setCookie = (newValue: Type) => {
        cookies.set(cookieName, newValue);
        setValue(newValue);
    };

    return [value, setCookie];
};

export default useCookie;
