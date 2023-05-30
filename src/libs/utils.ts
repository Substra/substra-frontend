import { ASSET_LABEL, AssetT } from '@/types/CommonTypes';

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

export const increaseDate = (date: Date, days: number) => {
    // adds days number of days to a given date
    return new Date(date.getTime() + days * 24 * 3600 * 1000);
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

    const seconds = duration % 60;
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
    // return duration in the format "3 days, 01h 30min 10s"
    let daysPrefix = '';
    if (days === 1) {
        daysPrefix = '1 day, ';
    } else if (days > 1) {
        daysPrefix = `${days} days, `;
    }

    return `${daysPrefix}${pad(hours)}h ${pad(minutes)}min ${pad(seconds)}s`;
};

export const formatDuration = (duration: number): string => {
    // duration expected in seconds
    const { seconds, minutes, hours, days } = getDurationParts(duration);

    return getDefaultDurationFormat(seconds, minutes, hours, days);
};

const getCompactDurationFormat = (
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

export const formatCompactDuration = (duration: number): string => {
    // duration expected in seconds
    const { seconds, minutes, hours, days } = getDurationParts(duration);

    let formattedSeconds: number;
    if (!days && !minutes && !hours && seconds < 10) {
        formattedSeconds = parseFloat(seconds.toFixed(2));
    } else {
        formattedSeconds = parseInt(seconds.toFixed(0));
    }

    return getCompactDurationFormat(formattedSeconds, minutes, hours, days);
};

const getExactDurationFormat = (
    seconds: number,
    minutes: number,
    hours: number,
    days: number
): string => {
    // format a duration that is expected to be an exact number of days, hours, minutes or seconds
    // if the duration is a mix of days, hours, minutes or seconds, then use the default duration format
    if (days && !hours && !minutes && !seconds) {
        return `${days}d`;
    } else if (!days && hours && !minutes && !seconds) {
        return `${hours}h`;
    } else if (!days && !hours && minutes && !seconds) {
        return `${minutes}min`;
    } else if (!days && !hours && !minutes && seconds) {
        return `${seconds}s`;
    } else {
        return getDefaultDurationFormat(seconds, minutes, hours, days);
    }
};

export const formatExactDuration = (duration: number): string => {
    const { seconds, minutes, hours, days } = getDurationParts(duration);

    return getExactDurationFormat(seconds, minutes, hours, days);
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

export const getAssetLabel = (
    asset: AssetT,
    { capitalized, plural }: { capitalized?: boolean; plural?: boolean }
): string => {
    let label = ASSET_LABEL[asset];
    if (capitalized) {
        label = capitalize(label);
    }
    if (plural) {
        label = label + 's';
    }
    return label;
};
