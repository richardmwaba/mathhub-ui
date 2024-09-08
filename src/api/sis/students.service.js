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
                name: StudentsService.getFullname(student.firstName, student.middleName, student.lastName),
                firstName: student.firstName,
                middleName: student.middleName,
                lastName: student.lastName,
                dateOfBirth: student.dateOfBirth,
                gender: student.gender,
                email: student.email,
                gradeName: student.grade ? student.grade.name : '',
                syllabus: student.examBoard ? student.examBoard.name : '',
                mobileNumber: StudentsService.getMobileNumber(student.phoneNumbers),
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

function getFullname(firstName, middleName, lastName) {
    return middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
}

function getMobileNumber(phoneNumbers) {
    return phoneNumbers.map((phoneNumber) => {
        return phoneNumber.type === 'MOBILE' ? `${phoneNumber.countryCode} ${phoneNumber.number}` : null;
    });
}

function getFormattedAddresses(addresses) {
    return addresses.map((address) => {
        const fullAddress =
            nonNullStringOf(address.firstAddress) +
            ', ' +
            nonNullStringOf(address.secondAddress) +
            ', ' +
            nonNullStringOf(address.thirdAddress) +
            ', ' +
            nonNullStringOf(address.city) +
            ', ' +
            nonNullStringOf(address.province);
        const fullAddressWithCleanStart = fullAddress.replace(/^\W+\s+/, '');

        return fullAddressWithCleanStart.replace(/\W+\s+/, ', ');
    });
}

function nonNullStringOf(str) {
    return str ?? '';
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
    getFullname,
    getFormattedAddresses,
    getMobileNumber,
    getStudentsParent,
};

export default StudentsService;
