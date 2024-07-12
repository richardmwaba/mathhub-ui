function getAllGrades(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/sis/grades', { signal: controller.signal })
        .then((response) => {
            let grades = [];

            const gradesList = response.data._embedded.gradeList;

            grades = gradesList
                .map((grade) => {
                    return {
                        id: grade.id,
                        name: Number.parseInt(grade.name),
                        description: grade.description,
                    };
                })
                .sort((a, b) => a.name - b.name);

            return grades;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createGrade(grade, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/sis/grades', grade, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editGrade(grade, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/sis/grades/${grade.id}`, grade, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const GradesService = { createGrade, editGrade, getAllGrades };

export default GradesService;
