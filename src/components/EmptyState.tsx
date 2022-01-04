import { Box, Button, Text, VStack } from '@chakra-ui/react';

interface EmptyStateProps {
    title: string;
    subtitle?: string;
    buttonOnClick?: () => void;
    buttonLabel?: string;
    icon: React.ReactNode;
}
const EmptyState = ({
    title,
    subtitle,
    buttonOnClick,
    icon,
    buttonLabel,
}: EmptyStateProps) => {
    return (
        <VStack spacing="5">
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
                <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                    {title}
                </Text>
                {subtitle && (
                    <Text fontSize="xs" color="gray.500">
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
