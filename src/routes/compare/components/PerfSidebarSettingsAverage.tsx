import { Box, Heading } from '@chakra-ui/react';

import BasePerfSidebarSettingsAverage from '@/components/PerfSidebarSettingsAverage';

const PerfSidebarSettingsAverage = (): JSX.Element => (
    <Box>
        <Heading size="xs" marginBottom={2.5}>
            Other
        </Heading>

        <BasePerfSidebarSettingsAverage />
    </Box>
);
export default PerfSidebarSettingsAverage;
