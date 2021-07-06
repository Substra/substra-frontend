/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const isEmpty = (obj: any): boolean => {
    return obj == null || !(Object.keys(obj) || obj).length;
};
