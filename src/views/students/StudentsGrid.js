import React, { useState, useEffect, setLoading } from 'react';
import { CCardBody, CButton, CSmartTable } from '@coreui/react-pro';
import { getData } from 'src/components/apiGateway.js';
import data from './_data.js';

export default function StudentsGrid() {
    const [loading, setLoading] = useState();
    const [currentItems, setCurrentItems] = useState(data);
    const [studentsApiResponse, setStudentsApiResponse] = useState(null);
    const [studentsSummary, setStudentsSummary] = useState([]);
    const [error, setError] = useState('');

    const csvContent = currentItems.map((item) => Object.values(item).join(',')).join('\n');

    const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);

    const columns = [
        {
            key: 'name',
        },
        {
            key: 'gender',
        },
        {
            key: 'grade',
        },
        {
            key: 'syllabus',
        },
        {
            key: 'phone_number',
        },
        {
            key: 'parents_name',
        },
        {
            key: 'parents_email',
        },
    ];

    function updateStudentsData(resonseData) {
        setStudentsApiResponse(resonseData);
        setStudentsSummary(extractStudentsSummary(resonseData));
    }

    // get students data from api
    useEffect(
        () =>
            getData(
                'http://localhost:8080/api/v1/sis/students',
                updateStudentsData,
                setError,
                setLoading,
            ),
        [],
    );

    console.log(studentsSummary);

    return (
        <CCardBody>
            <CButton
                color="primary"
                className="mb-2"
                href={csvCode}
                download="coreui-table-data.csv"
                target="_blank"
            >
                Download current items (.csv)
            </CButton>
            <CSmartTable
                columns={columns}
                columnFilter
                columnSorter
                items={studentsSummary}
                itemsPerPageSelect
                loading={loading}
                pagination
                tableProps={{
                    hover: true,
                    responsive: true,
                }}
            />
        </CCardBody>
    );
}

export function extractStudentsSummary(responseData) {
    let studentsSummary = [];

    if (!responseData) return [];

    const studentsList = responseData._embedded.studentDtoList;

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
}
