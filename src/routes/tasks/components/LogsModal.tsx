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

import CopyIconButton from '@/features/copy/CopyIconButton';
import { API_PATHS, compilePath } from '@/paths';

import DownloadIconButton from '@/components/DownloadIconButton';

import useTaskStore from '../useTaskStore';

const CodeHighlighter = React.lazy(
    () => import('@/components/CodeHighlighter')
);

type LogsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    taskKey: string;
};
const LogsModal = ({ isOpen, onClose, taskKey }: LogsModalProps) => {
    const initialFocusRef = useRef(null);

    const { logs, fetchingLogs, fetchLogs } = useTaskStore();

    useEffect(() => {
        fetchLogs(taskKey);
    }, [fetchLogs, taskKey]);

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
                            storageAddress={compilePath(API_PATHS.LOGS, {
                                key: taskKey,
                            })}
                            filename={`logs_${taskKey}`}
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
                    {fetchingLogs && <Text padding="6">Loading</Text>}
                    {!fetchingLogs && !logs && <Text padding="6">N/A</Text>}
                    {!fetchingLogs && logs && (
                        <Suspense fallback={<Text padding="6">Loading</Text>}>
                            <CodeHighlighter
                                language="python-repl"
                                children={logs}
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
