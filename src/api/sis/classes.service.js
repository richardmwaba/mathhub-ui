function getEnrolledClassPeriods() {
    return [
        { value: '', label: 'Select period...' },
        { value: 'Days', label: 'Days' },
        { value: 'Weeks', label: 'Weeks' },
        { value: 'Months', label: 'Months' },
    ];
}

function getSessionType(duration, period) {
    if (period === 'Months' && duration > 4) {
        return 'Long-term';
    }

    return 'Short-term';
}

const EnrolledClassService = { getEnrolledClassPeriods, getSessionType };

export default EnrolledClassService;
