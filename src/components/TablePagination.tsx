import { Flex, Text } from '@chakra-ui/react';

import Pagination from '@/components/Pagination';

declare const DEFAULT_PAGE_SIZE: number;

interface TablePaginationProps {
    currentPage: number;
    itemCount: number;
}

const TablePagination = ({
    currentPage,
    itemCount,
}: TablePaginationProps): JSX.Element => {
    const firstIndex = Math.max((currentPage - 1) * DEFAULT_PAGE_SIZE + 1, 0);
    const lastIndex = Math.min(currentPage * DEFAULT_PAGE_SIZE, itemCount);
    const lastPage = Math.ceil(itemCount / DEFAULT_PAGE_SIZE);

    return (
        <Flex justifyContent="space-between" alignItems="center" width="100%">
            <Text color="gray.500" fontSize="xs" lineHeight="4">
                {`${itemCount} results • ${firstIndex}-${lastIndex} shown`}
            </Text>
            <Pagination currentPage={currentPage} lastPage={lastPage} />
        </Flex>
    );
};
export default TablePagination;
