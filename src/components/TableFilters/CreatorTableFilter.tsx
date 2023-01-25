import { useEffect } from 'react';

import { Box, Checkbox, Text, VStack } from '@chakra-ui/react';

import useAuthStore from '@/features/auth/useAuthStore';
import useSelection from '@/hooks/useSelection';
import { useCreator, useMatch, usePage } from '@/hooks/useSyncedState';
import { useTableFilterCallbackRefs } from '@/hooks/useTableFilters';
import useUsersStore from '@/routes/users/useUsersStore';

import {
    getOptionDescription,
    getOptionLabel,
    getOptionValue,
} from './TableFilterCheckboxes';

const CreatorTableFilter = (): JSX.Element => {
    {
        /* Available options
        - Me (compute plans created by myself)
        - Externals (users of an other organization, is set as external in the backend)
        - All the users of my organization
    */
    }
    const [page] = usePage();
    const [match] = useMatch();

    const { users, fetchUsers } = useUsersStore();

    useEffect(() => {
        fetchUsers({ page, ordering: 'username', match });
    }, [page, match, fetchUsers]);

    const [tmpCreator, onTmpCreatorChange, resetTmpCreator, setTmpCreator] =
        useSelection();

    const [activeCreator] = useCreator();
    const { clearRef, applyRef, resetRef } =
        useTableFilterCallbackRefs('creator');

    clearRef.current = (urlSearchParams) => {
        resetTmpCreator();
        urlSearchParams.delete('creator');
    };

    applyRef.current = (urlSearchParams) => {
        if (tmpCreator.length > 0) {
            urlSearchParams.set('creator', tmpCreator.join(','));
        } else {
            urlSearchParams.delete('creator');
        }
    };

    resetRef.current = () => {
        setTmpCreator(activeCreator);
    };

    const {
        info: { user: me },
    } = useAuthStore();
    const meOption = {
        value: me,
        label: `Me (${me})`,
        description: 'Compute plan that I created',
    };

    const externalOption = {
        value: 'external',
        label: 'External',
        description: 'Compute plan created by other organizations',
    };

    const options = Object.values(users).map((user) => ({
        value: user.username,
        label: user.username,
    }));

    return (
        <Box w="100%" paddingY="5" paddingX="30px">
            <Text color="gray.500" fontSize="xs" mb="2.5">
                Filter by
            </Text>
            <VStack spacing="2.5" alignItems="flex-start">
                <Checkbox
                    value={getOptionValue(meOption)}
                    isChecked={tmpCreator.includes(getOptionValue(meOption))}
                    onChange={onTmpCreatorChange(getOptionValue(meOption))}
                    colorScheme="primary"
                    key={getOptionValue(meOption)}
                    alignItems="start"
                >
                    <Text fontSize="sm" lineHeight="1.2">
                        {getOptionLabel(meOption)}
                    </Text>
                    {getOptionDescription(meOption) && (
                        <Text color="gray.500" fontSize="xs">
                            {getOptionDescription(meOption)}
                        </Text>
                    )}
                </Checkbox>
                <Checkbox
                    value={getOptionValue(externalOption)}
                    isChecked={tmpCreator.includes(
                        getOptionValue(externalOption)
                    )}
                    onChange={onTmpCreatorChange(
                        getOptionValue(externalOption)
                    )}
                    colorScheme="primary"
                    key={getOptionValue(externalOption)}
                    alignItems="start"
                >
                    <Text fontSize="sm" lineHeight="1.2">
                        {getOptionLabel(externalOption)}
                    </Text>
                    {getOptionDescription(externalOption) && (
                        <Text color="gray.500" fontSize="xs">
                            {getOptionDescription(externalOption)}
                        </Text>
                    )}
                </Checkbox>
                <Text color="gray.500" fontSize="xs" mb="2.5">
                    From my organization
                </Text>
                {options.map((option) => (
                    <Checkbox
                        value={getOptionValue(option)}
                        isChecked={tmpCreator.includes(getOptionValue(option))}
                        onChange={onTmpCreatorChange(getOptionValue(option))}
                        colorScheme="primary"
                        key={getOptionValue(option)}
                        alignItems="start"
                    >
                        <Text fontSize="sm" lineHeight="1.2">
                            {getOptionLabel(option)}
                        </Text>
                        {getOptionDescription(option) && (
                            <Text color="gray.500" fontSize="xs">
                                {getOptionDescription(option)}
                            </Text>
                        )}
                    </Checkbox>
                ))}
            </VStack>
        </Box>
    );
};

CreatorTableFilter.filterTitle = 'Creator';
CreatorTableFilter.filterField = 'creator';

export default CreatorTableFilter;
