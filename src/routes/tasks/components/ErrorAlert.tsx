import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    Text,
    Button,
    useDisclosure,
    Link,
} from '@chakra-ui/react';
import { RiCheckboxCircleLine } from 'react-icons/ri';

import useHasPermission from '@/hooks/useHasPermission';
import { ErrorT, TaskT } from '@/types/TasksTypes';

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

const ErrorAlert = ({ task }: { task: TaskT }): JSX.Element | null => {
    const hasPermission = useHasPermission();
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!task.error_type) {
        return null;
    } else if (task.error_type === ErrorT.internal) {
        return (
            <ErrorAlertBase
                title="Internal error"
                description={
                    <>
                        An internal error occurred. Please contact your Substra
                        admnistrator to get access to logs.
                    </>
                }
            />
        );
    } else if (task.error_type === ErrorT.build) {
        if (!task.logs_permission || !hasPermission(task.logs_permission)) {
            return (
                <ErrorAlertBase
                    title="Build error"
                    description={
                        <>
                            An error occurred when building the container for
                            the task execution. Please check your function
                            archive or contact{' '}
                            <Link
                                href="https://lfaifoundation.slack.com/#substra-help"
                                isExternal
                            >
                                substra-help Slack channel
                            </Link>{' '}
                            to get access to logs.
                        </>
                    }
                />
            );
        } else {
            return (
                <>
                    <ErrorAlertBase
                        title="Build error"
                        description={
                            <>
                                <Text>
                                    An error occurred when building the
                                    container for the task execution.{' '}
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
                    <LogsModal
                        isOpen={isOpen}
                        onClose={onClose}
                        taskKey={task.key}
                    />
                </>
            );
        }
    } else {
        // task.error_type === ErrorT.execution
        if (!task.logs_permission || !hasPermission(task.logs_permission)) {
            return (
                <ErrorAlertBase
                    title="Execution error"
                    description={
                        <>
                            An error occurred during the task execution. Please
                            check your code, or contact{' '}
                            <Link
                                href="https://lfaifoundation.slack.com/#substra-help"
                                isExternal
                            >
                                substra-help Slack channel
                            </Link>{' '}
                            to get access to logs.
                        </>
                    }
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
                    <LogsModal
                        isOpen={isOpen}
                        onClose={onClose}
                        taskKey={task.key}
                    />
                </>
            );
        }
    }
};
export default ErrorAlert;
