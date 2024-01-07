function getAllStudents(axiosPrivate, controller, errorCallback) {
    return axiosPrivate
        .get('/v1/sis/students', { signal: controller.signal })
        .then((response) => {
            let studentsSummary = [];

            const studentsList = response.data._embedded.studentDtoList;

            studentsSummary = studentsList.map((detailedStudent) => {
                const studentMobilePhoneNumber = detailedStudent.phoneNumbers.map((phoneNumber) => {
                    return phoneNumber.type === 'MOBILE'
                        ? `${phoneNumber.countryCode} ${phoneNumber.number}`
                        : null;
                });

                return {
                    name: `${detailedStudent.firstName} ${detailedStudent.lastName}`,
                    gender: detailedStudent.gender,
                    grade: detailedStudent.grade.gradeName,
                    syllabus: detailedStudent.examBoard.examBoardName,
                    phone_number: studentMobilePhoneNumber,
                    parents_name: `${detailedStudent.parent.firstName} ${detailedStudent.parent.lastName}`,
                    parents_email: detailedStudent.parent.email,
                };
            });

            return studentsSummary;
        })
        .catch((error) => {
            errorCallback(error.message);
            console.error(error);
        });
}

const StudentsService = { getAllStudents };

export default StudentsService;
