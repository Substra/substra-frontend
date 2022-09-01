import { ChakraProps, Flex, Select, Text } from '@chakra-ui/react';

export type ModeT = 'min' | 'max' | 'between';

type InputComponentProps<T> = ChakraProps & {
    value: T | undefined;
    onChange: (newValue: T | undefined) => void;
};

type GenericRangeInputProps<T> = {
    minValue: T | undefined;
    maxValue: T | undefined;
    mode: ModeT;
    onMinValueChange: (v: T | undefined) => void;
    onMaxValueChange: (v: T | undefined) => void;
    InputComponent: ({
        value,
        onChange,
    }: InputComponentProps<T>) => JSX.Element;
    defaultMode: ModeT;
    setMode: (mode: ModeT) => void;
};

// In the following, T is a generic type.
// Eslint would like us to write <T,> instead of <T extends unknown>
// However this then confuses JSX who thinks <T,> is a JSX component
// declaration!
// The solution is to disable the eslint rule.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const GenericRangeInput = <T extends unknown>({
    minValue,
    onMinValueChange,
    maxValue,
    onMaxValueChange,
    mode,
    setMode,
    InputComponent,
}: GenericRangeInputProps<T>): JSX.Element => {
    const onModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMode: ModeT = e.target.value as ModeT;
        setMode(newMode as ModeT);
        if (newMode === 'max') {
            onMinValueChange(undefined);
        } else if (newMode === 'min') {
            onMaxValueChange(undefined);
        }
    };

    return (
        <Flex wrap="wrap" margin="-1" alignItems="center">
            <Select
                value={mode}
                onChange={onModeChange}
                size="sm"
                width="110px"
                flexShrink="0"
                margin="1"
            >
                <option value="min">Above</option>
                <option value="max">Below</option>
                <option value="between">Between</option>
            </Select>
            {['min', 'between'].includes(mode) && (
                <InputComponent
                    value={minValue}
                    onChange={onMinValueChange}
                    margin="1"
                />
            )}
            {mode === 'between' && <Text margin="1">and</Text>}
            {['max', 'between'].includes(mode) && (
                <InputComponent
                    value={maxValue}
                    onChange={onMaxValueChange}
                    margin="1"
                />
            )}
        </Flex>
    );
};
export default GenericRangeInput;
