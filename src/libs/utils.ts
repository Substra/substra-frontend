/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const isEmpty = (obj: any): boolean => {
    return obj == null || !(Object.keys(obj) || obj).length;
};

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
});

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return dateFormatter.format(date);
};
