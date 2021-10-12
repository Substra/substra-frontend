import { Heading } from '@chakra-ui/react';

export default ({ title }: { title: string }): JSX.Element => (
    <Heading size="xxs" textTransform="uppercase">
        {title}
    </Heading>
);
