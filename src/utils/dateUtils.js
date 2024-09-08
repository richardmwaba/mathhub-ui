import moment from 'moment';

function formatDate(date, format = 'ddd, DD MMM YYYY HH:mm') {
    return date ? moment(date).format(format) : 'Not available';
}

function addOneYearToDate(date) {
    return moment(date).add(1, 'year').format('YYYY-MM-DD');
}

const DateUtils = { formatDate, addOneYearToDate };

export default DateUtils;
