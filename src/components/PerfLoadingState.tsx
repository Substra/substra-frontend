import { useContext } from 'react';

import {
    Flex,
    VStack,
    Button,
    Wrap,
    WrapItem,
    Skeleton,
    Icon,
} from '@chakra-ui/react';
import { RiArrowLeftLine, RiDownloadLine } from 'react-icons/ri';
import { useLocation } from 'wouter';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import { compilePath, PATHS } from '@/routes';

const PerfLoadingState = (): JSX.Element => {
    const { computePlans } = useContext(PerfBrowserContext);
    const [, setLocation] = useLocation();
    return (
        <VStack
            flexGrow={1}
            alignSelf="stretch"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing="4"
            paddingX="8"
            paddingY="4"
            overflow="hidden"
        >
            <Flex justifyContent="space-between" alignItems="center">
                <Button
                    leftIcon={<RiArrowLeftLine />}
                    onClick={() =>
                        setLocation(
                            computePlans.length > 1
                                ? PATHS.COMPUTE_PLANS
                                : compilePath(PATHS.COMPUTE_PLAN_TASKS_ROOT, {
                                      key: computePlans[0].key,
                                  })
                        )
                    }
                    variant="ghost"
                    size="md"
                    fontWeight="medium"
                >
                    Go back
                </Button>
                <Skeleton>
                    <Button
                        leftIcon={<Icon as={RiDownloadLine} />}
                        variant="solid"
                        colorScheme="teal"
                        size="sm"
                    >
                        Download as CSV
                    </Button>
                </Skeleton>
            </Flex>
            <Wrap spacing="3">
                {[...Array(4)].map((_, index) => (
                    <WrapItem key={index}>
                        <Skeleton
                            width={480}
                            height={360}
                            border="2px solid transparent"
                        />
                    </WrapItem>
                ))}
            </Wrap>
        </VStack>
    );
};

export default PerfLoadingState;
