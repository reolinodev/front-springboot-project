export function getCurrentTime(type) {
    const now = moment();

    let timeFormat = 'YYYY.MM.DD HH:mm:ss';
    if (type === 'ymd') {
        timeFormat = 'YYYY.MM.DD';
    } else if (type === 'ymdhm') {
        timeFormat = 'YYYY.MM.DD HH:mm';
    }

    return now.format(timeFormat);
}

export function getCurrentStartEnd() {
    const now = moment();
    const day = {};
    const startDay = now.startOf('day').format('YYYY.MM.DD HH:mm:ss');
    const endDay = now.endOf('day').format('YYYY.MM.DD HH:mm:ss');

    day.start = startDay;
    day.end = endDay;

    return day;
}
