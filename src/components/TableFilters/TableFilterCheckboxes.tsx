import { Box, VStack, Text } from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react';

type OptionT = { value: string; label: string; description?: string } | string;

const getOptionValue = (option: OptionT) =>
    typeof option === 'string' ? option : option.value;

const getOptionLabel = (option: OptionT) =>
    typeof option === 'string' ? option : option.label;

const getOptionDescription = (option: OptionT) =>
    typeof option === 'string' ? null : option.description;

type TableFilterCheckboxesProps = {
    title?: string;
    value: string[];
    options: OptionT[];
    onChange: (
        value: string
    ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const TableFilterCheckboxes = ({
    title,
    value,
    onChange,
    options,
}: TableFilterCheckboxesProps): JSX.Element => {
    return (
        <Box w="100%" paddingY="5" paddingX="30px">
            <Text color="gray.500" fontSize="xs" mb="2.5">
                {title ?? 'Filter by'}
            </Text>
            <VStack spacing="2.5" alignItems="flex-start">
                {options.map((option) => (
                    <Checkbox
                        value={getOptionValue(option)}
                        isChecked={value.includes(getOptionValue(option))}
                        onChange={onChange(getOptionValue(option))}
                        colorScheme="teal"
                        key={getOptionValue(option)}
                        alignItems="start"
                    >
                        <Text fontSize="sm" lineHeight="1.2">
                            {getOptionLabel(option)}
                        </Text>
                        {getOptionDescription(option) && (
                            <Text color="gray.500" fontSize="xs">
                                {getOptionDescription(option)}
                            </Text>
                        )}
                    </Checkbox>
                ))}
            </VStack>
        </Box>
    );
};

export default TableFilterCheckboxes;
