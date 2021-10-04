import { Text } from '@chakra-ui/react';

interface TableTitleProps {
    title: string;
}
const TableTitle = ({ title }: TableTitleProps): JSX.Element => (
    <Text fontSize="xl" fontWeight="semibold" color="black">
        {title}
    </Text>
);

export default TableTitle;
