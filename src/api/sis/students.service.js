import { getFullname, getFullPhoneNumber } from 'src/components/common/serviceutils';

function getAllStudents(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/sis/students', { signal: controller.signal })
        .then((response) => {
            const studentsList = response.data._embedded.studentList;

            return studentsList.map((detailedStudent) => {
                return expandStudent(detailedStudent);
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
            return expandStudent(student);
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function expandStudent(student) {
    const defaultParent = StudentsService.getStudentsDefaultParent(student.parents)[0];
    return {
        id: student.id,
        name: getFullname(student.firstName, student.middleName, student.lastName),
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        email: student.email,
        gradeName: student.grade ? student.grade.name : '',
        syllabus: student.examBoard ? student.examBoard.name : '',
        phoneNumber: student.phoneNumber,
        fullPhoneNumber: getFullPhoneNumber(student.phoneNumber),
        defaultParent: defaultParent,
        parentName: defaultParent.name,
        parentEmail: defaultParent.email,
        parents: student.parents,
        grade: student.grade,
        classes: student.classes,
        address: student.address,
        examBoard: student.examBoard,
        phoneNumbers: student.phoneNumbers,
        financialSummary: student.financialSummary,
    };
}

function editStudent(editedStudent, axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .put(`/sis/students/${editedStudent.id}`, editedStudent, { signal: controller.signal })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

function getStudentsDefaultParent(parents) {
    return parents.map((parent) => {
        return {
            name: `${parent.firstName} ${parent.lastName}`,
            email: parent.email,
        };
    });
}

const StudentsService = {
    editStudent,
    getAllStudents,
    getStudentById,
    getStudentsDefaultParent,
};

export default StudentsService;
