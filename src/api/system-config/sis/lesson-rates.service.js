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
                    subjectComplexity: TextUtils.sentenceCase(lessonRate.subjectComplexity),
                    expiryDate: new Date(lessonRate.expiredDate).toDateString(),
                };
            });

            return lessonRates;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const LessonRatesService = { getAllLessonRates };

export default LessonRatesService;
