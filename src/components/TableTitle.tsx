import { Heading } from '@chakra-ui/react';

interface TableTitleProps {
    title: string;
}
const TableTitle = ({ title }: TableTitleProps): JSX.Element => (
    <Heading size="xxs" color="gray.800" textTransform="uppercase">
        {title}
    </Heading>
);

export default TableTitle;
