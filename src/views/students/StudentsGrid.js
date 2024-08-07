import React, { useState, useEffect } from 'react';
import { CCardBody, CButton, CSmartTable } from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilArrowThickToBottom } from '@coreui/icons';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import StudentsService from 'src/api/sis/students.service.js';
import { ViewDetailsButton } from 'src/components/common/ViewDetailsButton';
import { useNavigate } from 'react-router-dom';

export default function StudentsGrid() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

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
            key: 'gradeName',
            label: 'Grade',
            _style: { width: '10%' },
        },
        {
            key: 'syllabus',
            label: 'Syllabus',
            _style: { width: '10%' },
        },
        {
            key: 'mobileNumber',
            label: 'Phone Number',
            _style: { width: '15%' },
        },
        {
            key: 'parentName',
            label: "Parent's Name",
            _style: { width: '15%' },
        },
        {
            key: 'parentEmail',
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

    const handleRowClick = (student) => {
        setSelectedStudent(student);
        navigate(`/students/enrolment/${student.name}`, { state: student });
    };

    // get students data from api
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getStudents = async () => {
            const response = await StudentsService.getAllStudents(axiosPrivate, controller, setError);
            isMounted && setStudents(response) && setCurrentItems(response);
        };

        getStudents();
        setLoading(false);

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate]);

    const expandedStudents = students.map((student) => {
        const parent = getStudentsParent(student.parents)[0];
        return {
            id: student.id,
            name: getStudentsFullname(student.firstName, student.middleName, student.lastName),
            firstName: student.firstName,
            middleName: student.middleName,
            lastName: student.lastName,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            email: student.email,
            gradeName: student.grade ? student.grade.name : '',
            syllabus: student.examBoard ? student.examBoard.name : '',
            mobileNumber: getStudentsMobileNumber(student.phoneNumbers),
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
                items={expandedStudents}
                columns={columns}
                clickableRows
                itemsPerPage={10}
                columnFilter
                columnSorter
                tableFilter
                loading={loading}
                cleaner
                itemsPerPageSelect
                pagination
                noItemsLabel={
                    error ? `Could not retrieve students due to ${error}. Please try again.` : 'No students found'
                }
                onRowClick={(student) => handleRowClick(student)}
                scopedColumns={{
                    show_details: (currentStudent) => (
                        <ViewDetailsButton
                            item={currentStudent}
                            detailsLocation={`/students/enrolment/${currentStudent.name}`}
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
