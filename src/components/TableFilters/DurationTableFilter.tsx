import { useEffect, useState } from 'react';

import { Box, Text } from '@chakra-ui/react';

import { useDuration } from '@/hooks/useSyncedState';
import { useTableFilterCallbackRefs } from '@/hooks/useTableFilters';

import DurationInput from '@/components/DurationInput';
import GenericRangeInput, { ModeT } from '@/components/GenericRangeInput';

const defaultFilterDurationMode = 'min';

const DurationTableFilter = (): JSX.Element => {
    const [tmpMinDuration, setTmpMinDuration] = useState<number | undefined>(
        undefined
    );
    const [tmpMaxDuration, setTmpMaxDuration] = useState<number | undefined>(
        undefined
    );
    const [tmpMode, setTmpMode] = useState<ModeT>(defaultFilterDurationMode);
    const { durationMax: activeMaxDuration, durationMin: activeMinDuration } =
        useDuration();

    const { clearRef, applyRef, resetRef } =
        useTableFilterCallbackRefs('duration');

    clearRef.current = (urlSearchParams) => {
        setTmpMinDuration(undefined);
        setTmpMaxDuration(undefined);
        urlSearchParams.delete('duration_min');
        urlSearchParams.delete('duration_max');
    };

    applyRef.current = (urlSearchParams) => {
        if (tmpMinDuration === undefined) {
            urlSearchParams.delete('duration_min');
        } else {
            urlSearchParams.set('duration_min', tmpMinDuration.toString());
        }
        if (tmpMaxDuration === undefined) {
            urlSearchParams.delete('duration_max');
        } else {
            urlSearchParams.set('duration_max', tmpMaxDuration.toString());
        }
    };

    resetRef.current = () => {
        setTmpMinDuration(activeMinDuration);
        setTmpMaxDuration(activeMaxDuration);
    };

    useEffect(() => {
        setTmpMinDuration(activeMinDuration);
        setTmpMaxDuration(activeMaxDuration);

        setTmpMode(() => {
            if (activeMinDuration && activeMaxDuration) {
                return 'between';
            } else if (activeMinDuration) {
                return 'min';
            } else if (activeMaxDuration) {
                return 'max';
            }
            return defaultFilterDurationMode;
        });
    }, [activeMinDuration, activeMaxDuration]);

    return (
        <Box width="100%" paddingY="5" paddingX="30px">
            <Text color="gray.500" fontSize="xs" mb="2.5">
                Filter by
            </Text>
            <GenericRangeInput
                minValue={tmpMinDuration}
                maxValue={tmpMaxDuration}
                onMinValueChange={setTmpMinDuration}
                onMaxValueChange={setTmpMaxDuration}
                InputComponent={DurationInput}
                defaultMode="min"
                mode={tmpMode}
                setMode={setTmpMode}
            />
        </Box>
    );
};
DurationTableFilter.filterTitle = 'Duration';
DurationTableFilter.filterField = 'duration';

export default DurationTableFilter;
