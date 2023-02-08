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

const getDefaultDurationFormat = (
    seconds: number,
    minutes: number,
    hours: number,
    days: number
): string => {
    let daysPrefix = '';
    if (days === 1) {
        daysPrefix = '1 day, ';
    } else if (days > 1) {
        daysPrefix = `${days} days, `;
    }

    return `${daysPrefix}${pad(hours)}h ${pad(minutes)}min ${pad(seconds)}s`;
};

export const formatDuration = (duration: number): string => {
    // format duration in the format "3 days, 01h 30min 10s"
    const { seconds, minutes, hours, days } = getDurationParts(duration);

    return getDefaultDurationFormat(seconds, minutes, hours, days);
};

const getShortDurationFormat = (
    seconds: number,
    minutes: number,
    hours: number,
    days: number
): string => {
    if (!days && !hours && minutes) {
        return `${minutes}min ${pad(seconds)}s`;
    } else if (!days && !hours && !minutes) {
        if (seconds < 0.01) {
            return '<0.01s';
        }
        return `${seconds}s`;
    } else {
        return getDefaultDurationFormat(seconds, minutes, hours, days);
    }
};

export const formatExactDuration = (duration: number): string => {
    // format a duration that is expected to be an exact number of days, hours, minutes or seconds
    // if the duration is a mix of days, hours, minutes or seconds, then use the default duration format
    const { seconds, minutes, hours, days } = getDurationParts(duration);

    return getShortDurationFormat(seconds, minutes, hours, days);
};

export const formatDjangoFormatDuration = (duration: string): string => {
    // duration is expected in the format "DD HH:MM:SS.uuuuuu"
    const { seconds, minutes, hours, days } =
        getDjangoFormatDurationParts(duration);

    let formattedSeconds: number;
    if (!days && !minutes && !hours && seconds < 10) {
        formattedSeconds = parseFloat(seconds.toFixed(2));
    } else {
        formattedSeconds = parseInt(seconds.toFixed(0));
    }

    return getShortDurationFormat(formattedSeconds, minutes, hours, days);
};

export const parseNumberDjangoFormatDuration = (duration: string): number => {
    // duration is expected in the format "DD HH:MM:SS.uuuuuu"
    const { seconds, minutes, hours, days } =
        getDjangoFormatDurationParts(duration);

    // return duration in seconds
    return seconds + minutes * 60 + hours * 3600 + days * 86400;
};

const getDjangoFormatDurationParts = (duration: string) => {
    // duration is expected in the format "DD HH:MM:SS.uuuuuu"
    let days = 0;
    const daysSplit = duration.split(' ');

    if (daysSplit.length > 1) {
        days = parseInt(daysSplit[0]);
        duration = daysSplit[1];
    }

    const splitDurations = duration.split(':');
    const hours = parseInt(splitDurations[0]);
    const minutes = parseInt(splitDurations[1]);
    const seconds = parseFloat(splitDurations[2]);

    return {
        seconds,
        minutes,
        hours,
        days,
    };
};

export const endOfDay = (dateStringISO: string): string => {
    if (!dateStringISO) {
        return dateStringISO;
    }
    if (new Date(dateStringISO).toISOString().slice(0, 10) !== dateStringISO) {
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
