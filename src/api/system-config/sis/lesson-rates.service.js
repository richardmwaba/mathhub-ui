import DateUtils from 'src/utils/dateUtils';
import TextUtils from 'src/utils/textUtils';

function getAllLessonRates(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/sis/lessonRates', { signal: controller.signal })
        .then((response) => {
            let lessonRates = [];

            const lessonRatesList = response.data._embedded.lessonRateList;

            lessonRates = lessonRatesList.map((lessonRate) => {
                return {
                    id: lessonRate.lessonRateId,
                    amountPerLesson: parseFloat(lessonRate.amountPerLesson).toFixed(2),
                    effectiveDate: lessonRate.effectiveDate,
                    subjectComplexity: TextUtils.sentenceCase(lessonRate.subjectComplexity),
                    expiryDate: lessonRate.expiryDate,
                };
            });

            return lessonRates;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createLessonRate(newLessonRate, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/systemconfig/sis/lessonRates', newLessonRate, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editLessonRate(editedLessonRate, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/systemconfig/sis/lessonRates/${editedLessonRate.lessonRateId}`, editedLessonRate, {
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

const LessonRatesService = { getAllLessonRates, createLessonRate, editLessonRate };

export default LessonRatesService;
