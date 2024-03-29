export enum UserRolesT {
    admin = 'ADMIN',
    user = 'USER',
}

export type UserT = {
    username: string;
    role: UserRolesT;
    channel: string;
    email: string;
};

export type UserPayloadT = {
    username: string;
    password: string;
    role?: UserRolesT;
};

export type UpdateUserPayloadT = {
    username?: string;
    password?: string;
    role?: UserRolesT;
};

export type ResetPasswordT = {
    token: string;
    password: string;
};

export type UserApprovalPayloadT = {
    role: UserRolesT;
};
