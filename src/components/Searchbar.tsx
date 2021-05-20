import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Colors } from '@/assets/theme';

const SearchContainer = styled.input`
    border-radius: 25px;
    border-color: ${Colors.border};
    padding: 8px 24px;
`;

const SearchBar = (): JSX.Element => {
    const [value, setValue] = useState('');

    useEffect(() => {
        console.log(value);
    }, [value]);

    return (
        <SearchContainer
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};

export default SearchBar;
