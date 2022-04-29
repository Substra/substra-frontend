import React, { useEffect, useState } from 'react';

import { Box, Text, Select, HStack, Input } from '@chakra-ui/react';

interface TableFilterDateProps {
    minDate: string;
    maxDate: string;
    setMinDate: (date: string) => void;
    setMaxDate: (date: string) => void;
}

type Mode = 'after' | 'before' | 'between';
const TableFilterDate = ({
    minDate,
    maxDate,
    setMinDate,
    setMaxDate,
}: TableFilterDateProps): JSX.Element => {
    const getMode = (): Mode | null => {
        if (minDate && maxDate) {
            return 'between';
        } else if (minDate) {
            return 'after';
        } else if (maxDate) {
            return 'before';
        }
        return null;
    };
    const [mode, setMode] = useState<Mode>(() => getMode() || 'after');

    const onModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMode = e.target.value as Mode;
        setMode(newMode);
        if (newMode === 'after' && maxDate) {
            setMaxDate('');
        } else if (newMode === 'before' && minDate) {
            setMinDate('');
        }
    };

    useEffect(() => {
        const newMode = getMode();
        if (newMode) {
            setMode(newMode);
        }
    }, [minDate, maxDate]);

    return (
        <Box w="100%" paddingY="5" paddingX="30px">
            <Text color="gray.500" fontSize="xs" mb="2.5">
                Filter by
            </Text>
            <HStack spacing="2.5">
                <Select
                    size="sm"
                    width="120px"
                    value={mode}
                    onChange={onModeChange}
                >
                    <option value="after">After</option>
                    <option value="before">Before</option>
                    <option value="between">Between</option>
                </Select>
                {(mode === 'after' || mode === 'between') && (
                    <Input
                        type="date"
                        size="sm"
                        width="140px"
                        value={minDate}
                        onChange={(e) => setMinDate(e.target.value)}
                        max={maxDate ? maxDate : undefined}
                    />
                )}
                {mode === 'between' && <Text>and</Text>}
                {(mode === 'before' || mode === 'between') && (
                    <Input
                        type="date"
                        size="sm"
                        width="140px"
                        value={maxDate}
                        onChange={(e) => setMaxDate(e.target.value)}
                        min={minDate ? minDate : undefined}
                    />
                )}
            </HStack>
        </Box>
    );
};

export default TableFilterDate;
