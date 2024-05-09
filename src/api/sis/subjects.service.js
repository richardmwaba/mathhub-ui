function getAllSubjects(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/sis/subjects', { signal: controller.signal })
        .then((response) => {
            let subjects = [];

            const subjectsList = response.data._embedded.subjectList;

            subjects = subjectsList.map((subject) => {
                return {
                    id: subject.subjectId,
                    name: subject.subjectName,
                    grades: extractGrades(subject.subjectGrades),
                    complexity: subject.subjectComplexity,
                };
            });

            return subjects;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function createSubject(newSubject, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .post('/sis/subjects', newSubject, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function editSubject(editedSubject, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/sis/subjects/${editedSubject.subjectId}`, editedSubject, {
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

function getSubjectById(subjectId, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get(`/sis/subjects/${subjectId}`, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function extractGrades(grades) {
    return grades
        .map((grade) => {
            return {
                id: grade.gradeId,
                name: Number.parseInt(grade.gradeName),
            };
        })
        .sort((a, b) => a.name - b.name);
}

function getAllSubjectComplexities() {
    return [
        { value: '', label: 'Select complexity...' },
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' },
    ];
}

const SubjectsService = {
    createSubject,
    editSubject,
    getAllSubjects,
    getAllSubjectComplexities,
    getSubjectById,
};

export default SubjectsService;
