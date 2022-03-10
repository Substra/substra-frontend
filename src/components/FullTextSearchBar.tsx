import { useEffect, useState } from 'react';

import {
    InputGroup,
    InputLeftElement,
    Input,
    InputRightElement,
    CloseButton,
} from '@chakra-ui/react';
import { RiSearchLine } from 'react-icons/ri';

import useLocationWithParams from '@/hooks/useLocationWithParams';

const FullTextSearchBar = (): JSX.Element => {
    const [value, setValue] = useState('');

    const {
        params: { match },
        setLocationWithParams,
    } = useLocationWithParams();

    useEffect(() => {
        setValue(match);
    }, [match]);

    const applySearchFilters = (value: string) => {
        setLocationWithParams({ match: value, page: 1 });
    };

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        applySearchFilters(value);
    };

    const onClear = () => {
        applySearchFilters('');
    };

    const onBlur = () => {
        applySearchFilters(value);
    };

    return (
        <form onSubmit={onSubmit}>
            <InputGroup size="sm">
                <InputLeftElement
                    pointerEvents="none"
                    children={
                        <RiSearchLine fill="var(--chakra-colors-gray-400)" />
                    }
                />
                <Input
                    placeholder="Search name..."
                    variant="outline"
                    colorScheme="gray"
                    width="360px"
                    borderColor="gray.200"
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    focusBorderColor="teal.500"
                />
                <InputRightElement>
                    {value && <CloseButton size="sm" onClick={onClear} />}
                </InputRightElement>
            </InputGroup>
        </form>
    );
};

export default FullTextSearchBar;
