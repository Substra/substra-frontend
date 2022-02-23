import { VStack, Wrap, WrapItem, Skeleton } from '@chakra-ui/react';

const PerfLoadingState = (): JSX.Element => {
    return (
        <VStack
            flexGrow={1}
            alignSelf="stretch"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing="4"
            padding="8"
            overflow="hidden"
        >
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
