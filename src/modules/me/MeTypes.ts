import { UserRolesT } from '@/modules/users/UsersTypes';

export type MeInfoT = {
    host: string;
    organization_id: string;
    version?: string;
    orchestrator_version?: string;
    chaincode_version?: string;
    channel?: string;
    config: {
        model_export_enabled?: boolean;
    };
    user: string;
    user_role: UserRolesT;
    auth: MeInfoAuthT;
};

type MeInfoAuthT = {
    oidc?: {
        name: string;
        login_url: string;
    }
}