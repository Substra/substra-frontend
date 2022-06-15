import { getDiffDates } from './utils';

test('getDiffDates', () => {
    const start = '2022-01-01 00:00:00';
    // seconds only
    expect(getDiffDates(start, '2022-01-01 00:00:01')).toBe('00h 00min 01s');
    expect(getDiffDates(start, '2022-01-01 00:00:10')).toBe('00h 00min 10s');
    // minutes only
    expect(getDiffDates(start, '2022-01-01 00:01:00')).toBe('00h 01min 00s');
    expect(getDiffDates(start, '2022-01-01 00:10:00')).toBe('00h 10min 00s');
    // hours only
    expect(getDiffDates(start, '2022-01-01 01:00:00')).toBe('01h 00min 00s');
    expect(getDiffDates(start, '2022-01-01 10:00:00')).toBe('10h 00min 00s');
    // days only
    expect(getDiffDates(start, '2022-01-02 00:00:00')).toBe(
        '1 day, 00h 00min 00s'
    );
    expect(getDiffDates(start, '2022-01-11 00:00:00')).toBe(
        '10 days, 00h 00min 00s'
    );
    expect(getDiffDates(start, '2022-02-01 00:00:00')).toBe(
        '31 days, 00h 00min 00s'
    );
    // everything
    expect(getDiffDates(start, '2022-02-10 10:10:10')).toBe(
        '40 days, 10h 10min 10s'
    );
});
