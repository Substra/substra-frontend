import { UserRolesT } from '@/types/UsersTypes';

export const UserRolesToLabel: Record<UserRolesT, string> = {
    [UserRolesT.admin]: 'Admin',
    [UserRolesT.user]: 'User',
};

export const isDifferentFromUsername = (
    password: string,
    username: string
): boolean => {
    return password !== username;
};

export const hasCorrectLength = (password: string): boolean => {
    return password.length >= 20 && password.length <= 64;
};

export const hasSpecialChar = (password: string): boolean => {
    const regexSpecialChar = /[^A-Za-z0-9]/;
    return !!password.match(regexSpecialChar)?.length;
};

export const hasNumber = (password: string): boolean => {
    const regexNumber = /[0-9]/;
    return !!password.match(regexNumber);
};

export const hasLowerAndUpperChar = (password: string): boolean => {
    const regexLowerChar = /[a-z]/;
    const regexUpperChar = /[A-Z]/;

    return !!password.match(regexLowerChar) && !!password.match(regexUpperChar);
};

export const isPasswordValid = (
    password: string,
    username: string
): boolean => {
    return (
        isDifferentFromUsername(password, username) &&
        hasCorrectLength(password) &&
        hasSpecialChar(password) &&
        hasNumber(password) &&
        hasLowerAndUpperChar(password)
    );
};
