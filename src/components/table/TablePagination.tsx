import { Flex, Text } from '@chakra-ui/react';

import Pagination from '@/components/table/Pagination';

type TablePaginationProps = {
    currentPage: number;
    itemCount: number;
};

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
                {itemCount === 0 && `0 results`}
                {itemCount === 1 &&
                    `1 result • ${firstIndex}-${lastIndex} shown`}
                {itemCount > 1 &&
                    `${itemCount} results • ${firstIndex}-${lastIndex} shown`}
            </Text>
            <Pagination currentPage={currentPage} lastPage={lastPage} />
        </Flex>
    );
};
export default TablePagination;
