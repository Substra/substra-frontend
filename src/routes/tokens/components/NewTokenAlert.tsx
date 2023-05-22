import {
    Alert,
    AlertIcon,
    Box,
    AlertTitle,
    AlertDescription,
    HStack,
    Text,
} from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';

import CopyIconButton from '@/features/copy/CopyIconButton';

const NewTokenAlert = ({ tokenKey }: { tokenKey: string }): JSX.Element => {
    return (
        <Alert
            status="info"
            overflow="visible"
            background="green.100"
            padding={3}
        >
            <AlertIcon as={RiInformationLine} h={8} color="black" />

            <Box
                alignItems="stretch"
                width="100%"
                padding={1}
                background="green.100"
            >
                <AlertTitle fontSize="lg" color="black">
                    Your token has been generated!
                </AlertTitle>
                <AlertDescription maxWidth="sm" fontSize="sm" color="black">
                    Make sure to copy your personal access token now. You won’t
                    be able to see it again!
                </AlertDescription>
                <HStack alignItems="space-between" spacing="0" width="45%">
                    <Text
                        background="white"
                        padding="2"
                        fontSize="sm"
                        color="black"
                    >
                        {' '}
                        {tokenKey}
                    </Text>
                    <CopyIconButton value={tokenKey} aria-label="copy token" />
                </HStack>
            </Box>
        </Alert>
    );
};

export default NewTokenAlert;
