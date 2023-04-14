import { useContext } from 'react';

import { Box, Flex, Heading, Text, Select } from '@chakra-ui/react';

import {
    PerfBrowserContext,
    XAxisModeT,
    YAxisModeT,
} from '@/features/perfBrowser/usePerfBrowser';

const PerfSidebarSettingsUnits = (): JSX.Element => {
    const {
        xAxisMode,
        setXAxisMode,
        yAxisMode,
        setYAxisMode,
        seriesGroupsWithRounds,
    } = useContext(PerfBrowserContext);

    return (
        <Box>
            <Heading size="xs" marginBottom={4}>
                Parameters
            </Heading>
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="xs">X axis</Text>
                <Select
                    variant="filled"
                    width="115px"
                    size="xs"
                    fontWeight="semibold"
                    value={xAxisMode}
                    onChange={(e) => setXAxisMode(e.target.value as XAxisModeT)}
                >
                    <option value="rank">Ranks</option>
                    <option
                        value="round"
                        disabled={seriesGroupsWithRounds.length === 0}
                    >
                        Rounds
                    </option>
                </Select>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="xs">Y axis</Text>
                <Select
                    variant="filled"
                    width="115px"
                    size="xs"
                    fontWeight="semibold"
                    value={yAxisMode}
                    onChange={(e) => setYAxisMode(e.target.value as YAxisModeT)}
                >
                    <option value="linear">Linear</option>
                    <option value="logarithmic">Logarithmic</option>
                </Select>
            </Flex>
        </Box>
    );
};

export default PerfSidebarSettingsUnits;
