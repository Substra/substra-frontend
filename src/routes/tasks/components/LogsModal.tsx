import React, { useEffect, useRef, Suspense } from 'react';

import {
    Modal,
    ModalHeader,
    ModalOverlay,
    ModalContent,
    ModalBody,
    HStack,
    Text,
    CloseButton,
    Box,
} from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { URLS } from '@/modules/tasks/TasksApi';
import { retrieveLogs } from '@/modules/tasks/TasksSlice';
import { AnyTupleT } from '@/modules/tasks/TuplesTypes';

import CopyIconButton from '@/components/CopyIconButton';
import DownloadIconButton from '@/components/DownloadIconButton';

const CodeHighlighter = React.lazy(
    () => import('@/components/CodeHighlighter')
);

interface LogsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: AnyTupleT;
}
const LogsModal = ({ isOpen, onClose, task }: LogsModalProps) => {
    const initialFocusRef = useRef(null);

    const logs = useAppSelector((state) => state.tasks.logs);
    const logsLoading = useAppSelector((state) => state.tasks.logsLoading);

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(retrieveLogs(task.key));
    }, [task.key]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            initialFocusRef={initialFocusRef}
        >
            <ModalOverlay />
            <ModalContent
                maxWidth="calc(100% - 80px)"
                maxHeight="calc(100% - 80px)"
                width="100%"
                marginY="40px"
                overflow="hidden"
            >
                <ModalHeader
                    borderBottom="1px solid"
                    borderBottomColor="gray.100"
                    fontSize="md"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    padding="4"
                    paddingLeft="6"
                >
                    <Text>Logs</Text>
                    <HStack spacing="2.5">
                        <CopyIconButton
                            value={logs}
                            size="sm"
                            aria-label="Copy logs"
                            variant="ghost"
                        />
                        <DownloadIconButton
                            storageAddress={URLS.LOGS_RETRIEVE.replace(
                                '__KEY__',
                                task.key
                            )}
                            filename={`logs_${task.key}`}
                            aria-label="Download logs"
                            variant="ghost"
                        />
                        <Box
                            width="1px"
                            alignSelf="stretch"
                            borderLeft="1px solid"
                            borderLeftColor="gray.100"
                        />
                        <CloseButton
                            onClick={onClose}
                            size="md"
                            color="gray.500"
                            ref={initialFocusRef}
                        />
                    </HStack>
                </ModalHeader>
                <ModalBody
                    backgroundColor="gray.50"
                    padding="0"
                    fontSize="xs"
                    overflow="auto"
                >
                    {logsLoading && <Text padding="6">Loading</Text>}
                    {!logsLoading && !logs && <Text padding="6">N/A</Text>}
                    {!logsLoading && logs && (
                        <Suspense fallback={<Text padding="6">Loading</Text>}>
                            <CodeHighlighter
                                language="python-repl"
                                code={logs}
                                customStyle={{
                                    backgroundColor:
                                        'var(--chakra-colors-gray-50)',
                                }}
                            />
                        </Suspense>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export default LogsModal;
