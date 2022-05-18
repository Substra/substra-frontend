const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
});

export const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
});

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return dateFormatter.format(date);
};

export const shortFormatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return shortDateFormatter.format(date);
};

export const getDiffDates = (start: string | 'now', end: string | 'now') => {
    const startDate = start === 'now' ? new Date() : new Date(start);
    const endDate = end === 'now' ? new Date() : new Date(end);
    const diff = endDate.getTime() - startDate.getTime();

    let seconds: number | string = Math.floor((diff / 1000) % 60);
    let minutes: number | string = Math.floor((diff / (1000 * 60)) % 60);
    let hours: number | string = Math.floor((diff / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}h ${minutes}min ${seconds}s`;
};

export const endOfDay = (dateStringISO: string): string => {
    if (!dateStringISO) {
        return dateStringISO;
    }
    if (new Date(dateStringISO).toISOString().slice(0, 10) != dateStringISO) {
        throw (
            'expected a valid date in iso format YYYY-MM-DD, got ' +
            dateStringISO
        );
    }

    return dateStringISO + 'T23:59:59.999999Z';
};

export const capitalize = (word: string) => {
    const lower = word.toLowerCase();
    return word.charAt(0).toUpperCase() + lower.slice(1);
};

export function areSetEqual(s1: Set<string>, s2: Set<string>): boolean {
    if (s1.size !== s2.size) {
        return false;
    }

    for (const v of s1) {
        if (!s2.has(v)) {
            return false;
        }
    }

    return true;
}
