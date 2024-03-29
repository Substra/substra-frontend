import { Box, Button, Text, VStack } from '@chakra-ui/react';

type EmptyStateProps = {
    title: string;
    subtitle?: string;
    buttonOnClick?: () => void;
    buttonLabel?: string;
    icon: React.ReactNode;
    dataCy?: string;
};
const EmptyState = ({
    title,
    subtitle,
    buttonOnClick,
    icon,
    buttonLabel,
    dataCy,
}: EmptyStateProps) => {
    return (
        <VStack spacing="5" data-cy={dataCy}>
            <Box
                width="20"
                height="20"
                backgroundColor="gray.100"
                borderRadius="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="30px"
                color="gray.300"
            >
                {icon}
            </Box>
            <Box>
                <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="gray.500"
                    textAlign="center"
                >
                    {title}
                </Text>
                {subtitle && (
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                        {subtitle}
                    </Text>
                )}
            </Box>
            {buttonOnClick && buttonLabel && (
                <Button onClick={buttonOnClick} size="sm">
                    {buttonLabel}
                </Button>
            )}
        </VStack>
    );
};
export default EmptyState;
