import {
    Button,
    HStack,
    MenuItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';

import { useAppSelector } from '@/hooks';

import CopyButton from '@/components/CopyButton';
import {
    TableDrawerSection,
    TableDrawerSectionEntry,
} from '@/components/TableDrawerSection';

declare const __APP_VERSION__: string;
declare const API_URL: string;

const About = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const backendVersion = useAppSelector((state) => state.nodes.info.version);
    const orchestratorVersion = useAppSelector(
        (state) => state.nodes.info.orchestrator_version
    );
    const chaincodeVersion = useAppSelector(
        (state) => state.nodes.info.chaincode_version
    );

    return (
        <>
            <MenuItem onClick={onOpen}>About</MenuItem>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>About</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack alignItems="stretch" spacing="5">
                            <TableDrawerSection title="Version">
                                <TableDrawerSectionEntry title="Frontend">
                                    {__APP_VERSION__}
                                </TableDrawerSectionEntry>
                                <TableDrawerSectionEntry title="Backend">
                                    {backendVersion}
                                </TableDrawerSectionEntry>
                                <TableDrawerSectionEntry title="Orchestrator">
                                    {orchestratorVersion}
                                </TableDrawerSectionEntry>
                                {chaincodeVersion && (
                                    <TableDrawerSectionEntry title="Chaincode">
                                        {chaincodeVersion}
                                    </TableDrawerSectionEntry>
                                )}
                            </TableDrawerSection>
                            <TableDrawerSection title="Backend">
                                <TableDrawerSectionEntry title="URL">
                                    <HStack
                                        spacing={1.5}
                                        justifyContent="flex-end"
                                    >
                                        <span>{API_URL}</span>
                                        <CopyButton value={API_URL} />
                                    </HStack>
                                </TableDrawerSectionEntry>
                            </TableDrawerSection>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button size="sm" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export default About;
