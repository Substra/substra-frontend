import { useContext } from 'react';

import { Box, Flex, Heading, Text, Select } from '@chakra-ui/react';

import { PerfBrowserContext, XAxisMode } from '@/hooks/usePerfBrowser';

const PerfSidebarSettingsUnits = (): JSX.Element => {
    const { xAxisMode, setXAxisMode } = useContext(PerfBrowserContext);

    return (
        <Box>
            <Heading size="xs" marginBottom={4}>
                Parameters
            </Heading>
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="xs">X axis</Text>
                <Select
                    variant="filled"
                    width="90px"
                    size="xs"
                    fontWeight="semibold"
                    value={xAxisMode}
                    onChange={(e) => setXAxisMode(e.target.value as XAxisMode)}
                >
                    <option value="rank">Ranks</option>
                    <option value="epoch">Epochs</option>
                </Select>
            </Flex>
        </Box>
    );
};

export default PerfSidebarSettingsUnits;
