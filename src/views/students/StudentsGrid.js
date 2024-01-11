import React, { useState, useEffect } from 'react';
import { CCardBody, CButton, CSmartTable } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import StudentsService from 'src/api/students/students.service.js';

export default function StudentsGrid() {
    const axiosPrivate = useAxiosPrivate();

    const [loading, setLoading] = useState();
    const [currentItems, setCurrentItems] = useState([]);
    const [students, setStudents] = useState([]);
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
                items={students}
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
