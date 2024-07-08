import React, { useState, useEffect } from 'react';
import { CCardBody, CButton, CSmartTable } from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilArrowThickToBottom } from '@coreui/icons';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import StudentsService from 'src/api/sis/students.service.js';
import { ViewDetailsButton } from 'src/components/common/ViewDetailsButton';

export default function StudentsGrid() {
    const axiosPrivate = useAxiosPrivate();

    const [loading, setLoading] = useState(true);
    const [currentItems, setCurrentItems] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState({});
    const [error, setError] = useState('');

    const csvContent = currentItems.map((item) => Object.values(item).join(',')).join('\n');

    const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);

    const columns = [
        {
            key: 'name',
            label: 'Name',
            _style: { width: '20%' },
        },
        {
            key: 'gender',
            label: 'Gender',
            _style: { width: '10%' },
        },
        {
            key: 'grade',
            label: 'Grade',
            _style: { width: '10%' },
        },
        {
            key: 'syllabus',
            label: 'Syllabus',
            _style: { width: '10%' },
        },
        {
            key: 'phone_number',
            label: 'Phone Number',
            _style: { width: '15%' },
        },
        {
            key: 'parents_name',
            label: "Parent's Name",
            _style: { width: '15%' },
        },
        {
            key: 'parents_email',
            label: "Parent's Email",
            _style: { width: '15%' },
        },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            filter: false,
            sorter: false,
        },
    ];

    // get students data from api
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getStudents = async () => {
            const response = await StudentsService.getAllStudents(
                axiosPrivate,
                controller,
                setError,
            );
            isMounted && setStudents(response) && setCurrentItems(response);
        };

        getStudents();
        setLoading(false);

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate]);

    const studentsSummary = students.map((student) => {
        const parent = getStudentsParent(student.parents)[0];
        return {
            id: student.id,
            name: getStudentsFullname(student.firstName, student.middleName, student.lastName),
            gender: student.gender,
            grade: student.grade ? student.grade.gradeName : '',
            syllabus: student.examBoard ? student.examBoard.examBoardName : '',
            phone_number: getStudentsMobileNumber(student.phoneNumbers),
            parents_name: parent ? parent.parents_name : '',
            parents_email: parent ? parent.parents_email : '',
        };
    });

    return (
        <CCardBody>
            <CButton
                color="primary"
                className="mb-2"
                variant="outline"
                size="sm"
                href={csvCode}
                download="users-data.csv"
                target="_blank"
            >
                <CIcon icon={cilArrowThickToBottom} title="Download file" /> (.csv)
            </CButton>
            <CSmartTable
                sorterValue={{ column: 'name', state: 'asc' }}
                items={studentsSummary}
                columns={columns}
                itemsPerPage={10}
                columnFilter
                columnSorter
                tableFilter
                loading={loading}
                cleaner
                itemsPerPageSelect
                pagination
                noItemsLabel={
                    error
                        ? `Could not retrieve students due to ${error}. Please try again.`
                        : 'No students found'
                }
                scopedColumns={{
                    show_details: (currentStudent) => (
                        <ViewDetailsButton
                            item={students.find((student) => student.id === currentStudent.id)}
                            setSelectedItem={setSelectedStudent}
                        />
                    ),
                }}
                tableProps={{
                    hover: true,
                    responsive: true,
                    striped: true,
                }}
            />
        </CCardBody>
    );
}

function getStudentsFullname(firstName, middleName, lastName) {
    return middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
}

function getStudentsMobileNumber(phoneNumbers) {
    return phoneNumbers.map((phoneNumber) => {
        return phoneNumber.type === 'MOBILE'
            ? `${phoneNumber.countryCode} ${phoneNumber.number}`
            : null;
    });
}

function getStudentsParent(parents) {
    return parents.map((parent) => {
        return {
            parents_name: `${parent.firstName} ${parent.lastName}`,
            parents_email: parent.email,
        };
    });
}
