import { useRef, useState } from 'react';

import {
    Button,
    Text,
    VStack,
    HStack,
    Center,
    Box,
    Spacer,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    useDisclosure,
} from '@chakra-ui/react';

import { deleteToken } from '@/api/BearerTokenApi';
import { useToast } from '@/hooks/useToast';
import { shortFormatDate } from '@/libs/utils';
import { BearerTokenT, NewBearerTokenT } from '@/types/BearerTokenTypes';

const ApiToken = ({ token }: { token: BearerTokenT | NewBearerTokenT }) => {
    const apiToken = useState<BearerTokenT | NewBearerTokenT>(token)[0];
    const [isRevoked, setIsRevoked] = useState<boolean>(false);
    const toast = useToast();
    const {
        isOpen: isConfirmOpen,
        onOpen: onConfirmOpen,
        onClose: onConfirmClose,
    } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    const revokeToken = async () => {
        try {
            await deleteToken(token.id);
            setIsRevoked(true);
            toast({
                title: `${token.note} deleted`,
                descriptionComponent: 'This token is no longer valid.',
                status: 'success',
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Couldn't delete token",
                status: 'error',
                isClosable: true,
            });
        }
    };

    const tokenIsExpired = apiToken.expires_at
        ? apiToken.expires_at < new Date()
        : false;

    return isRevoked ? null : (
        <Box
            bg="white"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="gray.100"
            padding="20px"
        >
            <HStack>
                <VStack align="left">
                    <Text fontWeight="400" fontSize="md">
                        {apiToken.note}
                    </Text>
                    {apiToken.expires_at === null ? (
                        <Text
                            fontSize="sm"
                            fontWeight="400"
                        >{`Never Expires`}</Text>
                    ) : (
                        <HStack
                            color={tokenIsExpired ? 'red.500' : undefined}
                            spacing="1.5"
                            fontSize="sm"
                            fontWeight="400"
                        >
                            <Text>
                                {'Expire' +
                                    (tokenIsExpired ? 'd' : 's') +
                                    ` on ${
                                        shortFormatDate(
                                            apiToken.expires_at.toDateString()
                                        ).split(',')[0]
                                    } `}
                            </Text>
                            <Text>
                                {` at ${apiToken.expires_at
                                    .toLocaleTimeString()
                                    .slice(0, -3)}`}
                            </Text>
                        </HStack>
                    )}
                </VStack>
                <Spacer />
                <Center width="120px">
                    <Button
                        onClick={onConfirmOpen}
                        variant="outline"
                        size="sm"
                        fontWeight="600"
                    >
                        Delete
                    </Button>

                    <AlertDialog
                        isOpen={isConfirmOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onConfirmClose}
                        size="md"
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent fontSize="sm">
                                <AlertDialogHeader
                                    fontSize="lg"
                                    fontWeight="bold"
                                >
                                    Are you sure you want to delete this token?
                                </AlertDialogHeader>
                                <AlertDialogBody>
                                    Any applications or scripts using this token
                                    will no longer be able to access the Substra
                                    API. You cannot undo this action.
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                    <Button onClick={onConfirmClose} size="sm">
                                        Cancel
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        onClick={revokeToken}
                                        ml="3"
                                        size="sm"
                                    >
                                        Delete token
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </Center>
            </HStack>
        </Box>
    );
};

export default ApiToken;
