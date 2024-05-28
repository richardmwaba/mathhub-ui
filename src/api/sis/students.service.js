function getAllStudents(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/sis/students', { signal: controller.signal })
        .then((response) => {
            const studentsList = response.data._embedded.studentList;

            return studentsList.map((detailedStudent) => {
                return {
                    id: detailedStudent.studentId,
                    firstName: detailedStudent.firstName,
                    middleName: detailedStudent.middleName,
                    lastName: detailedStudent.lastName,
                    gender: detailedStudent.gender,
                    parents: detailedStudent.parents,
                    grade: detailedStudent.grade,
                    lessons: detailedStudent.lessons,
                    email: detailedStudent.email,
                    addresses: detailedStudent.addresses,
                    examBoard: detailedStudent.examBoard,
                    phoneNumbers: detailedStudent.phoneNumbers,
                    financialSummary: detailedStudent.studentFinancialSummary,
                    dateOfBirth: detailedStudent.dateOfBirth,
                };
            });
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const StudentsService = { getAllStudents };

export default StudentsService;
