import moment from 'moment';

function formatDate(date) {
    return moment(date).format('ddd, DD MMM YYYY HH:mm');
}

function addOneYearToDate(date) {
    return moment(date).add(1, 'year').format('YYYY-MM-DD');
}

const DateUtils = { formatDate, addOneYearToDate };

export default DateUtils;
