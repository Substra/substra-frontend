import LogsModal from './LogsModal';
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

import { AnyTupleT, ErrorType } from '@/modules/tasks/TuplesTypes';

import useHasPermission from '@/hooks/useHasPermission';

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
                title="An internal error occurred"
                description="Unable to fetch a model from another node or no GPU available. Please contact an administrator to check errors or give you logs access."
            />
        );
    } else if (task.error_type === ErrorType.build) {
        return (
            <ErrorAlertBase
                title="Build failed"
                description="An error occurred on algorithm and metric call. Please check your algorithm and metric archives. Please contact an administrator to check errors or give you logs access."
            />
        );
    } else {
        // task.error_type === ErrorType.execution
        if (!task.logs_permission || !hasPermission(task.logs_permission)) {
            return (
                <ErrorAlertBase
                    title="Execution failed"
                    description="An error occurred during your algorithm and metric execution. Please check your running code. Please contact an administrator to check errors or give you logs access."
                />
            );
        } else {
            return (
                <>
                    <ErrorAlertBase
                        title="Execution failed"
                        description={
                            <>
                                <Text>
                                    An error occurred during your algorithm and
                                    metric execution. Please check your running
                                    code.{' '}
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
