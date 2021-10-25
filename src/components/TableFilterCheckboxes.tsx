import { Box, VStack, Text } from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react';

type Option = { value: string; label: string } | string;

const getOptionValue = (option: Option) =>
    typeof option === 'string' ? option : option.value;

const getOptionLabel = (option: Option) =>
    typeof option === 'string' ? option : option.label;

interface TableFilterCheckboxesProps {
    value: string[];
    options: Option[];
    onChange: (
        value: string
    ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TableFilterCheckboxes = ({
    value,
    onChange,
    options,
}: TableFilterCheckboxesProps): JSX.Element => {
    return (
        <Box w="100%" paddingY="2.5" paddingX="5">
            <Text color="gray.500" fontSize="xs" mb="2.5">
                Filter by
            </Text>
            <VStack spacing="2.5" alignItems="flex-start">
                {options.map((option) => (
                    <Checkbox
                        value={getOptionValue(option)}
                        isChecked={value.includes(getOptionValue(option))}
                        onChange={onChange(getOptionValue(option))}
                        colorScheme="teal"
                        key={getOptionValue(option)}
                    >
                        <Text fontSize="sm">{getOptionLabel(option)}</Text>
                    </Checkbox>
                ))}
            </VStack>
        </Box>
    );
};

export default TableFilterCheckboxes;
