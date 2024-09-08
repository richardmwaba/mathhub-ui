function getAllStudents(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/sis/students', { signal: controller.signal })
        .then((response) => {
            const studentsList = response.data._embedded.studentList;

            return studentsList.map((detailedStudent) => {
                return {
                    id: detailedStudent.id,
                    firstName: detailedStudent.firstName,
                    middleName: detailedStudent.middleName,
                    lastName: detailedStudent.lastName,
                    gender: detailedStudent.gender,
                    parents: detailedStudent.parents,
                    grade: detailedStudent.grade,
                    classes: detailedStudent.classes,
                    email: detailedStudent.email,
                    addresses: detailedStudent.addresses,
                    examBoard: detailedStudent.examBoard,
                    phoneNumbers: detailedStudent.phoneNumbers,
                    financialSummary: detailedStudent.financialSummary,
                    dateOfBirth: detailedStudent.dateOfBirth,
                };
            });
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function getStudentById(studentId, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get(`sis/students/${studentId}`, { signal: controller.signal })
        .then((response) => {
            const student = response.data;
            const parent = StudentsService.getStudentsParent(student.parents)[0];
            return {
                id: student.id,
                name: StudentsService.getStudentsFullname(student.firstName, student.middleName, student.lastName),
                firstName: student.firstName,
                middleName: student.middleName,
                lastName: student.lastName,
                dateOfBirth: student.dateOfBirth,
                gender: student.gender,
                email: student.email,
                gradeName: student.grade ? student.grade.name : '',
                syllabus: student.examBoard ? student.examBoard.name : '',
                mobileNumber: StudentsService.getStudentsMobileNumber(student.phoneNumbers),
                parentName: parent ? parent.parentName : '',
                parentEmail: parent ? parent.parentEmail : '',
                parents: student.parents,
                grade: student.grade,
                classes: student.classes,
                addresses: student.addresses,
                examBoard: student.examBoard,
                phoneNumbers: student.phoneNumbers,
                financialSummary: student.financialSummary,
            };
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function getStudentsFullname(firstName, middleName, lastName) {
    return middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
}

function getStudentsMobileNumber(phoneNumbers) {
    return phoneNumbers.map((phoneNumber) => {
        return phoneNumber.type === 'MOBILE' ? `${phoneNumber.countryCode} ${phoneNumber.number}` : null;
    });
}

function getStudentsParent(parents) {
    return parents.map((parent) => {
        return {
            parentName: `${parent.firstName} ${parent.lastName}`,
            parentEmail: parent.email,
        };
    });
}

const StudentsService = {
    getAllStudents,
    getStudentById,
    getStudentsFullname,
    getStudentsMobileNumber,
    getStudentsParent,
};

export default StudentsService;
