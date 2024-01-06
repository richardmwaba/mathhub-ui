import axios from 'src/api/axios';

const headers = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
};

function getAllStudents(controller, errorCallback) {
    return axios
        .get('/students', { signal: controller.signal }, headers)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Something went wrong while fetching this data. Please try again.');
            }

            let studentsSummary = [];

            const studentsList = response._embedded.studentDtoList;

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
        });
}

const StudentsService = {};

export default StudentsService;
