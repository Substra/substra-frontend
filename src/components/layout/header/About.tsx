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
import { DrawerSection, DrawerSectionEntry } from '@/components/DrawerSection';

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
                            <DrawerSection title="Version">
                                <DrawerSectionEntry title="Frontend">
                                    {__APP_VERSION__}
                                </DrawerSectionEntry>
                                <DrawerSectionEntry title="Backend">
                                    {backendVersion}
                                </DrawerSectionEntry>
                                <DrawerSectionEntry title="Orchestrator">
                                    {orchestratorVersion}
                                </DrawerSectionEntry>
                                {chaincodeVersion && (
                                    <DrawerSectionEntry title="Chaincode">
                                        {chaincodeVersion}
                                    </DrawerSectionEntry>
                                )}
                            </DrawerSection>
                            <DrawerSection title="Backend">
                                <DrawerSectionEntry title="URL">
                                    <HStack spacing={1.5}>
                                        <span>{API_URL}</span>
                                        <CopyButton value={API_URL} />
                                    </HStack>
                                </DrawerSectionEntry>
                            </DrawerSection>
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
