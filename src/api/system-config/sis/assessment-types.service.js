function getAllAssessmentTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/sis/assessmentTypes', { signal: controller.signal })
        .then((response) => {
            return response.data._embedded.assessmentTypeList;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createAssessmentType(newAssessmentType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/systemconfig/sis/assessmentTypes', newAssessmentType, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editAssessmentType(editedAssessmentType, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/systemconfig/sis/assessmentTypes/${editedAssessmentType.id}`, editedAssessmentType, {
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

const AssessmentTypesService = { createAssessmentType, editAssessmentType, getAllAssessmentTypes };

export default AssessmentTypesService;
