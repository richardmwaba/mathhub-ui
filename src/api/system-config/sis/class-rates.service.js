import TextUtils from 'src/utils/textUtils';

function getAllclassRates(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/sis/classRates', { signal: controller.signal })
        .then((response) => {
            let classRates = [];

            const classRatesList = response.data._embedded.classRateList;

            classRates = classRatesList.map((classRate) => {
                return {
                    id: classRate.id,
                    amount: parseFloat(classRate.amount).toFixed(2),
                    effectiveDate: classRate.effectiveDate,
                    subjectComplexity: TextUtils.sentenceCase(classRate.subjectComplexity),
                    expiryDate: classRate.expiryDate,
                };
            });

            return classRates;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createclassRate(newclassRate, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/systemconfig/sis/classRates', newclassRate, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editclassRate(editedclassRate, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/systemconfig/sis/classRates/${editedclassRate.id}`, editedclassRate, {
            signal: controller.signal,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const classRatesService = { getAllclassRates, createclassRate, editclassRate };

export default classRatesService;
