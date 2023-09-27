import { useEffect, useState } from 'react';

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
    Text,
} from '@chakra-ui/react';

import useAuthStore from '@/features/auth/useAuthStore';
import CopyButton from '@/features/copy/CopyButton';
import useReleasesInfoStore from '@/features/docs/useReleasesInfoStore';
import { ReleaseInfoT, ReleasesInfoT } from '@/types/DocsTypes';

import { DrawerSection, DrawerSectionEntry } from '@/components/DrawerSection';

const About = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        info: {
            version: backendVersion,
            orchestrator_version: orchestratorVersion,
            chaincode_version: chaincodeVersion,
        },
    } = useAuthStore();

    const releases = useReleasesInfoStore();
    const [matchingRelease, setMatchingRelease] =
        useState<ReleaseInfoT | null>();
    useEffect(() => {
        if (isOpen) releases.fetchInfo();
    }, [isOpen, releases]);

    useEffect(() => {
        if (releases.info && backendVersion && orchestratorVersion) {
            setMatchingRelease(
                getMatchingSubstraRelease(
                    __APP_VERSION__,
                    backendVersion,
                    orchestratorVersion,
                    releases.info
                )
            );
        } else {
            setMatchingRelease(null);
        }
    }, [releases.info, backendVersion, orchestratorVersion]);

    const getMatchingSubstraRelease = (
        frontendVersion: string,
        backendVersion: string,
        orchestratorVersion: string,
        releases: ReleasesInfoT
    ) => {
        const candidateReleases = releases.releases.filter((it) => {
            return (
                it.components['substra-frontend'].version === frontendVersion &&
                it.components['substra-backend'].version === backendVersion &&
                it.components.orchestrator.version === orchestratorVersion
            );
        });
        if (candidateReleases.length === 0) {
            return null;
        } else {
            return candidateReleases[0];
        }
    };

    return (
        <>
            <MenuItem onClick={onOpen} data-cy="about">
                About
            </MenuItem>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent data-cy="about-modal">
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
                            <Text>
                                {releases.fetchingInfo
                                    ? 'fetching bundle info..'
                                    : matchingRelease
                                    ? matchingRelease.version
                                    : 'no matching Substra bundle release'}
                            </Text>
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
