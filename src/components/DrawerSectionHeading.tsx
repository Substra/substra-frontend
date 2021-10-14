import { Heading } from '@chakra-ui/react';

export default ({
    title,
    children,
}: {
    title: string;
    children?: React.ReactNode;
}): JSX.Element => (
    <Heading
        size="xxs"
        textTransform="uppercase"
        display="flex"
        alignItems="center"
    >
        <span>{title}</span>
        {children}
    </Heading>
);
