import {
    Alert,
    AlertIcon,
    Box,
    AlertTitle,
    AlertDescription,
    HStack,
    Text,
    AlertProps,
} from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';

import CopyIconButton from '@/features/copy/CopyIconButton';

type NewTokenAlertProps = AlertProps & {
    tokenKey: string;
};

const NewTokenAlert = ({
    tokenKey,
    ...props
}: NewTokenAlertProps): JSX.Element => {
    return (
        <Alert
            status="info"
            overflow="visible"
            background="green.100"
            paddingX="4"
            paddingY="3"
            {...props}
        >
            <AlertIcon as={RiInformationLine} color="green.900" />

            <Box alignItems="stretch" width="100%" background="green.100">
                <AlertTitle fontSize="md" color="green.900">
                    Your token has been generated!
                </AlertTitle>
                <AlertDescription maxWidth="sm" fontSize="md" color="green.900">
                    Make sure to copy your personal access token now. You won’t
                    be able to see it again!
                </AlertDescription>
                <HStack
                    marginTop="2.5"
                    spacing="0"
                    alignItems="center"
                    justifyContent="stretch"
                    //height="32px"
                >
                    <Box background="white" paddingX="3" paddingY="2">
                        <Text fontSize="sm" color="gray.500" fontWeight="400">
                            {tokenKey}
                        </Text>
                    </Box>

                    <CopyIconButton
                        value={tokenKey}
                        aria-label="copy token"
                        height="37"
                    />
                </HStack>
            </Box>
        </Alert>
    );
};

export default NewTokenAlert;
