import React, { useState, useEffect } from 'react';
import { CCardBody, CButton, CSmartTable } from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilArrowThickToBottom } from '@coreui/icons';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import StudentsService from 'src/api/sis/students.service.js';
import { ViewDetailsButton } from 'src/components/common/ViewDetailsButton';
import { useNavigate } from 'react-router-dom';

const studentDetailsButton = {
    show_details: (currentStudent) => (
        <ViewDetailsButton
            key={currentStudent.id}
            item={currentStudent}
            detailsLocation={`/students/enrolment/${currentStudent.id}`}
        />
    ),
};

export default function StudentsGrid() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [currentItems, setCurrentItems] = useState([]);
    const [students, setStudents] = useState([]);
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
            key: 'fullPhoneNumber',
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
        navigate(`/students/enrolment/${student.id}`, { state: student });
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
                items={students}
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
                scopedColumns={studentDetailsButton}
                tableProps={{
                    hover: true,
                    responsive: true,
                    striped: true,
                }}
            />
        </CCardBody>
    );
}
