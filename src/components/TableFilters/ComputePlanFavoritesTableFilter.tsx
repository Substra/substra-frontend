import { useState } from 'react';

import { Box, Checkbox, Text } from '@chakra-ui/react';

import { useFavoritesOnly } from '@/hooks/useSyncedState';
import { useTableFilterCallbackRefs } from '@/hooks/useTableFilters';

const ComputePlanFavoritesTableFilter = ({
    favorites,
}: {
    favorites: string[];
}): JSX.Element => {
    const [tmpFavoritesOnly, setTmpFavoritesOnly] = useState(false);

    const [activeFavoritesOnly] = useFavoritesOnly();
    const { clearRef, applyRef, resetRef } =
        useTableFilterCallbackRefs('favorites');

    clearRef.current = (urlSearchParams) => {
        urlSearchParams.delete('favorites_only');
    };

    applyRef.current = (urlSearchParams) => {
        if (tmpFavoritesOnly) {
            urlSearchParams.set('favorites_only', '1');
        } else {
            urlSearchParams.delete('favorites_only');
        }
    };

    resetRef.current = () => {
        setTmpFavoritesOnly(activeFavoritesOnly);
    };

    const onChange = () => {
        setTmpFavoritesOnly(!tmpFavoritesOnly);
    };

    return (
        <Box w="100%" paddingY="5" paddingX="30px">
            <Text color="gray.500" fontSize="xs" mb="2.5">
                Filter by
            </Text>
            <Checkbox
                isChecked={tmpFavoritesOnly}
                isDisabled={!favorites.length}
                onChange={onChange}
                colorScheme="teal"
                alignItems="start"
            >
                <Text fontSize="sm" lineHeight="1.2">
                    Favorites Only
                </Text>
            </Checkbox>
            {!favorites.length && (
                <Text color="gray.500" fontSize="xs">
                    You currently have no favorite compute plan
                </Text>
            )}
        </Box>
    );
};

ComputePlanFavoritesTableFilter.filterTitle = 'Favorites';
ComputePlanFavoritesTableFilter.filterField = 'favorites_only';

export default ComputePlanFavoritesTableFilter;
