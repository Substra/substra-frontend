import { useContext } from 'react';

import { Flex, Switch, Text } from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

const PerfSidebarSettingsAverage = (): JSX.Element => {
    const { displayAverage, setDisplayAverage } =
        useContext(PerfBrowserContext);
    return (
        <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="xs">Show average</Text>
            <Switch
                size="sm"
                isChecked={displayAverage}
                onChange={() => setDisplayAverage(!displayAverage)}
            />
        </Flex>
    );
};
export default PerfSidebarSettingsAverage;
