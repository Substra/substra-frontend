import { useContext } from 'react';

import { Box, Flex, Heading, Switch, Text } from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

const PerfSidebarSettingsAverage = (): JSX.Element => {
    const { displayAverage, setDisplayAverage } =
        useContext(PerfBrowserContext);
    return (
        <Box>
            <Heading size="xs" marginBottom={4}>
                Other
            </Heading>
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="xs">Show average</Text>
                <Switch
                    size="sm"
                    isChecked={displayAverage}
                    onChange={() => setDisplayAverage(!displayAverage)}
                />
            </Flex>
        </Box>
    );
};
export default PerfSidebarSettingsAverage;
