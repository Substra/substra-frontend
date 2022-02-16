import { useContext } from 'react';

import {
    Box,
    ButtonGroup,
    Flex,
    Heading,
    Text,
    Button,
} from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

const PerfSidebarSettingsUnits = (): JSX.Element => {
    const { xAxisMode, setXAxisMode } = useContext(PerfBrowserContext);

    return (
        <Box>
            <Heading size="xs" marginBottom={4}>
                Others
            </Heading>
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="xs">Units</Text>
                <ButtonGroup size="xs" isAttached>
                    <Button
                        colorScheme={xAxisMode === 'rank' ? 'teal' : undefined}
                        onClick={() => setXAxisMode('rank')}
                    >
                        Ranks
                    </Button>
                    <Button
                        colorScheme={xAxisMode === 'epoch' ? 'teal' : undefined}
                        onClick={() => setXAxisMode('epoch')}
                    >
                        Epochs
                    </Button>
                </ButtonGroup>
            </Flex>
        </Box>
    );
};

export default PerfSidebarSettingsUnits;
