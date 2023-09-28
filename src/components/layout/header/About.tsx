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
    Spinner,
    Link,
    Code,
    Box,
    Alert,
    AlertIcon,
    AlertDescription,
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

    const {
        info: releasesInfo,
        fetchingInfo: fetchingReleasesInfo,
        fetchInfo: fetchReleasesInfo,
    } = useReleasesInfoStore();
    const [matchingRelease, setMatchingRelease] =
        useState<ReleaseInfoT | null>();

    useEffect(() => {
        if (isOpen) fetchReleasesInfo();
    }, [isOpen, fetchReleasesInfo]);

    useEffect(() => {
        if (releasesInfo && backendVersion && orchestratorVersion) {
            setMatchingRelease(
                getMatchingSubstraRelease(
                    __APP_VERSION__,
                    backendVersion,
                    orchestratorVersion,
                    releasesInfo
                )
            );
        } else {
            setMatchingRelease(null);
        }
    }, [releasesInfo, backendVersion, orchestratorVersion]);

    const getMatchingSubstraRelease = (
        frontendVersion: string,
        backendVersion: string,
        orchestratorVersion: string,
        releases: ReleasesInfoT
    ) => {
        const candidateReleases = releases.releases.filter((it) => {
            return (
                it.components['substra-frontend'].version ===
                    frontendVersion.split('+')[0] &&
                it.components['substra-backend'].version ===
                    backendVersion.split('+')[0] &&
                it.components.orchestrator.version ===
                    orchestratorVersion.split('+')[0]
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
                            <Box fontSize="xs">
                                {fetchingReleasesInfo ? (
                                    <HStack>
                                        <Spinner
                                            color="gray.400"
                                            size="xs"
                                            label="Fetching bundle info"
                                        />
                                        <Text>{'Fetching bundle info'}</Text>
                                    </HStack>
                                ) : (
                                    <>
                                        {matchingRelease ? (
                                            <Alert
                                                status="info"
                                                alignItems={'center'}
                                            >
                                                <AlertIcon />
                                                <AlertDescription>
                                                    <Text>
                                                        {
                                                            'This server is running Substra '
                                                        }
                                                        <Text as="b">
                                                            {`${matchingRelease.version}`}
                                                        </Text>
                                                        {'.'}
                                                    </Text>
                                                    <Text>
                                                        {
                                                            'In Python, you should use '
                                                        }
                                                        <Code fontSize="xs">
                                                            {`substra==${matchingRelease.components.substra.version}`}
                                                        </Code>
                                                        {' and/or '}
                                                        <Code fontSize="xs">
                                                            {`substrafl==${matchingRelease.components.substrafl.version}`}
                                                        </Code>
                                                        {'.'}
                                                    </Text>
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <Alert
                                                status="warning"
                                                alignItems={'center'}
                                            >
                                                <AlertIcon />
                                                <AlertDescription>
                                                    <Text>
                                                        {
                                                            'This server is not running a '
                                                        }

                                                        <Link
                                                            color="black"
                                                            href="https://docs.substra.org/en/latest/additional/release.html"
                                                            isExternal
                                                            textDecoration={
                                                                'underline'
                                                            }
                                                            textUnderlineOffset={
                                                                3
                                                            }
                                                        >
                                                            known Substra
                                                            release
                                                        </Link>
                                                        {'.'}
                                                    </Text>
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </>
                                )}
                            </Box>
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
