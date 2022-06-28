import { useEffect, useState } from 'react';

import {
    ChakraProps,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
} from '@chakra-ui/react';

type UnitT = 'seconds' | 'minutes' | 'hours' | 'days';

type DurationInputProps = ChakraProps & {
    value: number | undefined;
    onChange: (newValue: number | undefined) => void;
};

const getDuration = (
    number: number | undefined,
    unit: UnitT
): number | undefined => {
    if (number === undefined) {
        return undefined;
    } else if (unit === 'seconds') {
        return number;
    } else if (unit === 'minutes') {
        return number * 60;
    } else if (unit === 'hours') {
        return number * 3600;
    } else if (unit === 'days') {
        return number * 3600 * 24;
    }
};

const parseDuration = (
    duration: number | undefined
): { number: number | undefined; unit: UnitT } => {
    if (duration === undefined) {
        return {
            number: undefined,
            unit: 'seconds',
        };
    }

    if (duration === 0) {
        return {
            number: 0,
            unit: 'seconds',
        };
    }

    const daysRemainder = duration % (3600 * 24);
    if (daysRemainder === 0) {
        return {
            number: Math.floor(duration / (3600 * 24)),
            unit: 'days',
        };
    }

    const hoursRemainder = duration % 3600;
    if (hoursRemainder === 0) {
        return {
            number: Math.floor(duration / 3600),
            unit: 'hours',
        };
    }

    const minutesRemainder = duration % 60;
    if (minutesRemainder === 0) {
        return {
            number: Math.floor(duration / 60),
            unit: 'minutes',
        };
    }

    return {
        number: duration,
        unit: 'seconds',
    };
};

const DurationInput = ({
    value,
    onChange,
    ...props
}: DurationInputProps): JSX.Element => {
    const [unit, setUnit] = useState<UnitT>(() => parseDuration(value).unit);
    const [number, setNumber] = useState<number>();

    const onUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newUnit: UnitT = e.target.value as UnitT;
        setUnit(newUnit);
        onChange(getDuration(number, newUnit));
    };

    const onNumberChange = (newNumber: string) => {
        const newNumberAsNumber = parseInt(newNumber);
        if (isNaN(newNumberAsNumber)) {
            console.warn(`${newNumber} is not a valid integer`);
            return;
        }
        setNumber(newNumberAsNumber);
        onChange(getDuration(newNumberAsNumber, unit));
    };

    useEffect(() => {
        const { number: newNumber, unit: newUnit } = parseDuration(value);
        setNumber(newNumber);
        setUnit(newUnit);
    }, [value]);

    return (
        <HStack spacing="1" {...props}>
            <NumberInput
                size="sm"
                width="140px"
                defaultValue={0}
                value={number}
                onChange={onNumberChange}
                min={0}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            <Select value={unit} onChange={onUnitChange} size="sm">
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
            </Select>
        </HStack>
    );
};
export default DurationInput;
