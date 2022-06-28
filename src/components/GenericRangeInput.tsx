import { useEffect, useState } from 'react';

import { ChakraProps, Flex, Select, Text } from '@chakra-ui/react';

type ModeT = 'min' | 'max' | 'between';

type InputComponentProps<T> = ChakraProps & {
    value: T | undefined;
    onChange: (newValue: T | undefined) => void;
};

type GenericRangeInputProps<T> = {
    minValue: T | undefined;
    maxValue: T | undefined;
    onMinValueChange: (v: T | undefined) => void;
    onMaxValueChange: (v: T | undefined) => void;
    InputComponent: ({
        value,
        onChange,
    }: InputComponentProps<T>) => JSX.Element;
    defaultMode: ModeT;
    modeLabels: Record<ModeT, string>;
};

const getMode = (
    minValue: unknown | undefined,
    maxValue: unknown | undefined,
    defaultMode: ModeT
): ModeT => {
    if (minValue === undefined && maxValue === undefined) {
        return defaultMode;
    }
    if (minValue === undefined) {
        return 'max';
    }
    if (maxValue === undefined) {
        return 'min';
    }
    return 'between';
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
    defaultMode,
    modeLabels,
    InputComponent,
}: GenericRangeInputProps<T>): JSX.Element => {
    const [mode, setMode] = useState<ModeT>(() =>
        getMode(minValue, maxValue, defaultMode)
    );

    const onModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMode: ModeT = e.target.value as ModeT;
        setMode(newMode as ModeT);
        if (newMode === 'max') {
            onMinValueChange(undefined);
        } else if (newMode === 'min') {
            onMaxValueChange(undefined);
        }
    };

    useEffect(() => {
        setMode(getMode(minValue, maxValue, defaultMode));
    }, [minValue, maxValue, defaultMode]);

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
                <option value="min">{modeLabels.min}</option>
                <option value="max">{modeLabels.max}</option>
                <option value="between">{modeLabels.between}</option>
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
