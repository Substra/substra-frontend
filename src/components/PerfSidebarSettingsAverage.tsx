import { useContext } from 'react';

import { Box, Flex, Switch, Text, Tooltip } from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

const PerfSidebarSettingsAverage = (): JSX.Element => {
    const { displayAverage, setDisplayAverage } =
        useContext(PerfBrowserContext);
    return (
        <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="xs">Show average</Text>
            <Tooltip
                label="Show average of all displayed values"
                fontSize="xs"
                hasArrow
                placement="top"
            >
                <Box>
                    <Switch
                        size="sm"
                        isChecked={displayAverage}
                        onChange={() => setDisplayAverage(!displayAverage)}
                    />
                </Box>
            </Tooltip>
        </Flex>
    );
};
export default PerfSidebarSettingsAverage;
