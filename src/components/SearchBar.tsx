import { useEffect, useState } from 'react';

import {
    InputGroup,
    InputLeftElement,
    Input,
    InputRightElement,
    CloseButton,
} from '@chakra-ui/react';
import { RiSearchLine } from 'react-icons/ri';

import {
    useSyncedNumberState,
    useSyncedStringState,
} from '@/hooks/useSyncedState';

type SearchBarProps = {
    placeholder?: string;
};
const SearchBar = ({ placeholder }: SearchBarProps): JSX.Element => {
    const [match, setMatch] = useSyncedStringState('match', '');
    const [, setPage] = useSyncedNumberState('page', 1);
    const [value, setValue] = useState(match);

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setMatch(value);
        setPage(1);
    };

    const onClear = () => {
        setValue('');
        setMatch('');
        setPage(1);
    };

    const onBlur = () => {
        setMatch(value);
        setPage(1);
    };

    useEffect(() => {
        if (match !== value) {
            setValue(match);
        }
        // this effect is meant to be triggered only when match changes, not when value changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match]);

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
                    placeholder={placeholder || 'Search name or key...'}
                    variant="outline"
                    colorScheme="gray"
                    width="360px"
                    borderColor="gray.200"
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    focusBorderColor="primary.500"
                />
                <InputRightElement>
                    {value && <CloseButton size="sm" onClick={onClear} />}
                </InputRightElement>
            </InputGroup>
        </form>
    );
};

export default SearchBar;
