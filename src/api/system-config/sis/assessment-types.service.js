function getAllAssessmentTypes(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/systemconfig/sis/assessmentTypes', { signal: controller.signal })
        .then((response) => {
            let assessmentTypes = [];

            const assessmentTypesList = response.data._embedded.assessmentTypeDtoList;

            assessmentTypes = assessmentTypesList.map((assessmentType) => {
                return {
                    id: assessmentType.assessmentTypeId,
                    type: assessmentType.typeName,
                    description: assessmentType.typeDescription,
                };
            });

            return assessmentTypes;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const AssessmentTypesService = { getAllAssessmentTypes };

export default AssessmentTypesService;
