import { Tooltip, Flex, Text, Box } from '@chakra-ui/react';

interface PerformanceCardProps {
    title: string;
    children: React.ReactNode;
    onClick: () => void;
}

const PerfCard = ({
    title,
    children,
    onClick,
}: PerformanceCardProps): JSX.Element => {
    return (
        <Flex
            flexDirection="column"
            width={480}
            height={360}
            margin="10px"
            boxShadow="md"
            padding={2}
            backgroundColor="white"
            justifyContent="space-between"
            border="2px solid transparent"
            _hover={{ borderColor: 'teal.500', borderWidth: 2 }}
            onClick={onClick}
            cursor="pointer"
        >
            <Box flexGrow={1}>{children}</Box>
            <Tooltip label={title} fontSize="xs" hasArrow placement="bottom">
                <Text isTruncated fontWeight="medium" fontSize="sm">
                    {title}
                </Text>
            </Tooltip>
        </Flex>
    );
};

export default PerfCard;