function getAllGrades(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/sis/grades', { signal: controller.signal })
        .then((response) => {
            let grades = [];

            const gradesList = response.data._embedded.gradeDtoList;

            grades = gradesList.map((grade) => {
                return {
                    id: grade.gradeId,
                    type: grade.gradeName,
                    description: grade.gradeDescription,
                };
            });

            return grades;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const GradesService = { getAllGrades };

export default GradesService;
