import React, { useState, useEffect } from 'react';
import {
    CCardBody,
    CButton,
    CCollapse,
    CFormCheck,
    CFormLabel,
    CSmartTable,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilArrowThickToBottom } from '@coreui/icons';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import StudentsService from 'src/api/sis/students.service.js';

export default function StudentsGrid() {
    const axiosPrivate = useAxiosPrivate();

    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState();
    const [details, setDetails] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');

    const studentsWithSelect = students?.map((student) => {
        const _selected = selected.includes(student.id);
        return {
            ...student,
            subject: student,
            _selected,
            _classes: [student._classes, _selected && 'table-selected'],
        };
    });

    const csvContent = currentItems.map((item) => Object.values(item).join(',')).join('\n');

    const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);

    const columns = [
        { key: 'select', label: '', filter: false, sorter: false },
        {
            key: 'name',
            label: 'Name',
            _style: { width: '20%' },
        },
        {
            key: 'gender',
            label: 'Genger',
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

    const toggleDetails = (index) => {
        const position = details.indexOf(index);
        let newDetails = details.slice();
        if (position !== -1) {
            newDetails.splice(position, 1);
        } else {
            newDetails = [...details, index];
        }
        setDetails(newDetails);
    };

    const check = (e, id) => {
        if (e.target.checked) {
            setSelected([...selected, id]);
        } else {
            setSelected(selected.filter((itemId) => itemId !== id));
        }
    };

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
                <CIcon icon={cilArrowThickToBottom} title="Download file" /> (.csv)
            </CButton>
            <CSmartTable
                sorterValue={{ column: 'name', state: 'asc' }}
                columns={columns}
                itemsPerPage={10}
                columnFilter
                columnSorter
                items={studentsWithSelect}
                itemsPerPageSelect
                tableFilter
                cleaner
                loading={loading}
                pagination
                scopedColumns={{
                    select: (item) => {
                        return GridCheckBox(item, check);
                    },
                    show_details: (item) => {
                        return ToggleButton(toggleDetails, item, details);
                    },
                    details: (item) => {
                        return DetailsCard(details, item);
                    },
                }}
                tableProps={{
                    hover: true,
                    responsive: true,
                }}
            />
        </CCardBody>
    );
}

function GridCheckBox(item, check) {
    return (
        <td>
            <CFormCheck
                id={`checkbox${item.id}`}
                checked={item._selected}
                onChange={(e) => check(e, item.id)}
            />
            <CFormLabel variant="custom-checkbox" htmlFor={`checkbox${item.id}`} />
        </td>
    );
}

function DetailsCard(details, item) {
    return (
        <CCollapse visible={details.includes(item.id)}>
            <CCardBody>
                <h4>{item.username}</h4>
                <p className="text-muted">User since: {item.registered}</p>
                <CButton size="sm" color="info">
                    User Settings
                </CButton>
                <CButton size="sm" color="danger" className="ml-1">
                    Delete
                </CButton>
            </CCardBody>
        </CCollapse>
    );
}

function ToggleButton(toggleDetails, item, details) {
    return (
        <td className="py-2">
            <CButton
                color="primary"
                variant="outline"
                shape="square"
                size="sm"
                onClick={() => {
                    toggleDetails(item.id);
                }}
            >
                {details.includes(item.id) ? 'Hide' : 'Show'}
            </CButton>
        </td>
    );
}
