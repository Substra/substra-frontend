export type ReleasesInfoT = {
    components: string[];
    releases: ReleaseInfoT[];
};

export type ReleaseInfoT = {
    version: string;
    components: {
        'substra-backend': ComponentReleaseT;
        'substra-frontend': ComponentReleaseT;
        orchestrator: ComponentReleaseT;
        substra: ComponentReleaseT;
        substrafl: ComponentReleaseT;
        'substra-tools': ComponentReleaseT;
    };
};

type ComponentReleaseT = {
    version: string;
    link: string;
    helm?: HelmReleaseInfoT;
};

type HelmReleaseInfoT = {
    version: string;
    link: string;
};
