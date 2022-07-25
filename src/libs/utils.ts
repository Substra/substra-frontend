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

export const timestampNow = (): string => new Date().toISOString();

export const getDiffDates = (start: string | 'now', end: string | 'now') => {
    const startDate = start === 'now' ? new Date() : new Date(start);
    const endDate = end === 'now' ? new Date() : new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    // diff is in ms, but formatDuration expects seconds as input
    return formatDuration(Math.round(diff / 1000));
};

const getDurationParts = (duration: number) => {
    // duration is expected to be in seconds
    const seconds = Math.floor(duration % 60);
    const minutes = Math.floor((duration / 60) % 60);
    const hours = Math.floor((duration / (60 * 60)) % 24);
    const days = Math.floor(duration / (24 * 60 * 60));

    return {
        seconds,
        minutes,
        hours,
        days,
    };
};

const pad = (n: number): string => {
    // transforms a number into a string,
    // and adds "0" at the beginning to make the string 2 chars long
    return n.toString().padStart(2, '0');
};

export const formatDuration = (duration: number): string => {
    // format duration in the format "3 days, 01h 30min 10s"
    const { hours, minutes, seconds, days } = getDurationParts(duration);

    let daysPrefix = '';
    if (days === 1) {
        daysPrefix = '1 day, ';
    } else if (days > 1) {
        daysPrefix = `${days} days, `;
    }

    return `${daysPrefix}${pad(hours)}h ${pad(minutes)}min ${pad(seconds)}s`;
};

export const formatShortDuration = (duration: number): string => {
    // format a duration that is expected to be an exact number of days, hours, minutes or seconds
    // if the duration is a mix of days, hours, minutes or seconds, then use the default duration format
    const { hours, minutes, seconds, days } = getDurationParts(duration);

    if (days && !hours && !minutes && !seconds) {
        return `${days}d`;
    } else if (!days && hours && !minutes && !seconds) {
        return `${hours}h`;
    } else if (!days && !hours && minutes && !seconds) {
        return `${minutes}min`;
    } else if (!days && !hours && !minutes && seconds) {
        return `${seconds}s`;
    } else {
        return formatDuration(duration);
    }
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
