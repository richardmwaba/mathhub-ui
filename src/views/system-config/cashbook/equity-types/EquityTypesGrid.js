import React, { useState, useEffect } from 'react';
import {
    CButton,
    CCardBody,
    CCollapse,
    CFormCheck,
    CFormLabel,
    CSmartTable,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import EquityTypesService from 'src/api/system-config/cashbook/equity-types.service';

export default function EquityTypesGrid() {
    const axiosPrivate = useAxiosPrivate();

    const [selected, setSelected] = useState([]);
    const [details, setDetails] = useState([]);
    const [equityTypes, setEquityTypes] = useState([]);
    const [error, setError] = useState('');

    const equityTypesWithSelect = equityTypes?.map((equityTypes) => {
        const _selected = selected.includes(equityTypes.id);
        return {
            ...equityTypes,
            equityTypes,
            _selected,
            _classes: [equityTypes._classes, _selected && 'table-selected'],
        };
    });

    const columns = [
        { key: 'select', label: '', filter: false, sorter: false },
        {
            key: 'description',
            label: 'Name',
            _style: { width: '60%' },
        },
        { key: 'type', label: 'Short Name', _style: { width: '40%' } },
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

        const getEquityTypes = async () => {
            const response = await EquityTypesService.getAllEquityTypes(
                axiosPrivate,
                controller,
                setError,
            );
            isMounted && setEquityTypes(response);
        };

        getEquityTypes();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate]);

    return (
        <CCardBody>
            <CSmartTable
                sorterValue={{ column: 'description', state: 'asc' }}
                items={equityTypesWithSelect}
                columns={columns}
                itemsPerPage={10}
                columnFilter
                columnSorter
                tableFilter
                cleaner
                itemsPerPageSelect
                pagination
                scopedColumns={{
                    select: (item) => {
                        return (
                            <td>
                                <CFormCheck
                                    id={`checkbox${item.id}`}
                                    checked={item._selected}
                                    onChange={(e) => check(e, item.id)}
                                />
                                <CFormLabel
                                    variant="custom-checkbox"
                                    htmlFor={`checkbox${item.id}`}
                                />
                            </td>
                        );
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