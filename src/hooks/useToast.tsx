import {
    UseToastOptions,
    useToast as useChakraToast,
    Alert,
    AlertIcon,
    Box,
    AlertTitle,
    AlertDescription,
    CloseButton,
} from '@chakra-ui/react';
import {
    RiCheckboxCircleLine,
    RiErrorWarningLine,
    RiInformationLine,
} from 'react-icons/ri';

type CustomUseToastOptionsT = Omit<UseToastOptions, 'description'> & {
    descriptionComponent?:
        | string
        | React.FunctionComponent<{ onClose: () => void }>;
};

export const useToast = () => {
    const toast = useChakraToast();

    const returnFunction = (options: CustomUseToastOptionsT) => {
        let duration = options.duration;
        if (duration === undefined) {
            if (typeof options.descriptionComponent === 'string') {
                duration = options.descriptionComponent.length * 100;
            } else {
                duration = 3000;
            }
        }

        return toast({
            position: 'bottom-left',
            duration,
            render: ({ onClose }) => (
                <Alert variant="subtle" status={options.status} width="sm">
                    {options.status === 'success' && (
                        <AlertIcon as={RiCheckboxCircleLine} />
                    )}
                    {options.status === 'warning' ||
                        (options.status === 'error' && (
                            <AlertIcon as={RiErrorWarningLine} />
                        ))}
                    {options.status === 'info' && (
                        <AlertIcon as={RiInformationLine} />
                    )}
                    <Box flex="1">
                        <AlertTitle fontSize="sm">{options.title}</AlertTitle>
                        {options.descriptionComponent && (
                            <AlertDescription display="block" fontSize="sm">
                                {typeof options.descriptionComponent ===
                                'string' ? (
                                    options.descriptionComponent
                                ) : (
                                    <options.descriptionComponent
                                        onClose={onClose}
                                    />
                                )}
                            </AlertDescription>
                        )}
                    </Box>
                    {options.isClosable && (
                        <CloseButton
                            position="absolute"
                            right="4px"
                            top="4px"
                            size="sm"
                            onClick={onClose}
                        />
                    )}
                </Alert>
            ),
            ...options,
        });
    };

    return Object.assign(returnFunction, toast);
};
