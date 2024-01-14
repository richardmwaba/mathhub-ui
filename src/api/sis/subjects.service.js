function getAllSubjects(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/sis/subjects', { signal: controller.signal })
        .then((response) => {
            let subjects = [];

            const subjectsList = response.data._embedded.subjectDtoList;

            subjects = subjectsList.map((subject) => {
                return {
                    id: subject.subjectId,
                    subjectName: subject.subjectName,
                    subjectGrade: subject.subjectGrade.gradeName,
                };
            });

            return subjects;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const SubjectsService = { getAllSubjects };

export default SubjectsService;
