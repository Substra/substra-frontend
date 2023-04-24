import { useContext, useMemo } from 'react';

import { List, ListItem, Checkbox, Text, Skeleton } from '@chakra-ui/react';

import {
    OrganizationListItem,
    PerfSidebarContainer,
    SerieListItem,
} from '@/features/perfBrowser/PerfSidebarCommon';
import { PerfBrowserContext } from '@/features/perfBrowser/usePerfBrowser';

const OrganizationList = ({ computePlanKey }: { computePlanKey: string }) => {
    const { organizations: allOrganizations, isOrganizationIdSelected } =
        useContext(PerfBrowserContext);
    const organizations = useMemo(
        () =>
            allOrganizations.filter((organization) =>
                isOrganizationIdSelected(organization.id)
            ),
        [allOrganizations, isOrganizationIdSelected]
    );
    return (
        <PerfSidebarContainer title="Lines">
            <List>
                {organizations.map((organization) => (
                    <OrganizationListItem
                        key={organization.id}
                        organizationId={organization.id}
                        computePlanKey={computePlanKey}
                    />
                ))}
            </List>
        </PerfSidebarContainer>
    );
};

const SerieList = () => {
    const { rankData: allRankData, isOrganizationIdSelected } =
        useContext(PerfBrowserContext);
    const rankData = useMemo(
        () =>
            allRankData.filter((serieRankData) =>
                isOrganizationIdSelected(serieRankData.worker)
            ),
        [allRankData, isOrganizationIdSelected]
    );
    return (
        <PerfSidebarContainer title="Lines">
            <List marginX="-20px">
                {rankData.map((serieRankData) => (
                    <SerieListItem
                        serieRankData={serieRankData}
                        key={serieRankData.id}
                    />
                ))}
            </List>
        </PerfSidebarContainer>
    );
};

const PerfSidebarLines = (): JSX.Element => {
    const { computePlans, loading, selectedMetricName } =
        useContext(PerfBrowserContext);

    const computePlanKey = computePlans.length > 0 ? computePlans[0].key : '';

    if (loading) {
        return (
            <PerfSidebarContainer title="Lines">
                <List spacing="2.5">
                    {[...Array(3)].map((_, index) => (
                        <ListItem
                            key={index}
                            display="flex"
                            alignItems="baseline"
                        >
                            <Skeleton>
                                <Checkbox>
                                    <Text
                                        as="span"
                                        fontSize="xs"
                                        fontWeight="semibold"
                                    >
                                        Lorem ipsum dolor sit amet
                                    </Text>
                                </Checkbox>
                            </Skeleton>
                        </ListItem>
                    ))}
                </List>
            </PerfSidebarContainer>
        );
    }

    if (!selectedMetricName) {
        return <OrganizationList computePlanKey={computePlanKey} />;
    }

    return <SerieList />;
};

export default PerfSidebarLines;
