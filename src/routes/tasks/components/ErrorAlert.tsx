import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    Text,
    Button,
    useDisclosure,
} from '@chakra-ui/react';
import { RiCheckboxCircleLine } from 'react-icons/ri';

import useHasPermission from '@/hooks/useHasPermission';
import { AnyTupleT, ErrorType } from '@/modules/tasks/TuplesTypes';

import LogsModal from './LogsModal';

const ErrorAlertBase = ({
    title,
    description,
}: {
    title: string;
    description: React.ReactNode;
}): JSX.Element => (
    <Alert status="error" variant="subtle" overflow="visible">
        <AlertIcon as={RiCheckboxCircleLine} fill="red.900" />
        <Box>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription lineHeight="4">{description}</AlertDescription>
        </Box>
    </Alert>
);

const ErrorAlert = ({ task }: { task: AnyTupleT }): JSX.Element | null => {
    const hasPermission = useHasPermission();
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!task.error_type) {
        return null;
    } else if (task.error_type === ErrorType.internal) {
        return (
            <ErrorAlertBase
                title="Internal error"
                description="An internal error occurred. Please contact support@owkin.com to get access to logs. "
            />
        );
    } else if (task.error_type === ErrorType.build) {
        return (
            <ErrorAlertBase
                title="Build error"
                description="An error occurred when building the container for the task execution. Please check your algorithm archive or metric archive, or contact support@owkin.com to get access to logs."
            />
        );
    } else {
        // task.error_type === ErrorType.execution
        if (!task.logs_permission || !hasPermission(task.logs_permission)) {
            return (
                <ErrorAlertBase
                    title="Execution error"
                    description="An error occurred during the task execution. Please check your code, or contact support@owkin.com to get access to logs."
                />
            );
        } else {
            return (
                <>
                    <ErrorAlertBase
                        title="Execution error"
                        description={
                            <>
                                <Text>
                                    An error occurred during the task execution.{' '}
                                    <Button
                                        variant="link"
                                        size="xs"
                                        color="red.900"
                                        onClick={onOpen}
                                    >
                                        See complete logs
                                    </Button>
                                </Text>
                            </>
                        }
                    />
                    <LogsModal isOpen={isOpen} onClose={onClose} task={task} />
                </>
            );
        }
    }
};
export default ErrorAlert;
