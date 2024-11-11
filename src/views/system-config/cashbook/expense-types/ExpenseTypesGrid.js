/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import ExpenseTypesService from 'src/api/system-config/cashbook/expense-types.service';
import CIcon from '@coreui/icons-react';
import NewExpenseTypeForm from './NewExpenseTypeForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditExpenseTypeForm from './EditExpenseTypeForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';

export default function ExpenseTypesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [expenseTypes, setExpenseTypes] = useState([]);
    const [createdExpenseType, setCreatedExpenseType] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditExpenseTypeModal, setIsVisibleEditExpenseTypeModal] = useState(false);
    const [isVisibleNewExpenseTypeModal, setIsVisibleNewExpenseTypeModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedExpenseType, setSavedExpenseType] = useState({});
    const [selectedExpenseType, setSelectedExpenseType] = useState({});
    const [toast, setToast] = useState(0);

    const expenseTypeActionSuccessToasterRef = useRef();

    const columns = [
        { key: 'name', label: 'Name', _style: { width: '40%' } },
        {
            key: 'description',
            label: 'Description',
            _style: { width: '60%' },
        },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            filter: false,
            sorter: false,
        },
    ];

    const getExpenseTypes = async () => {
        const response = await ExpenseTypesService.getAllExpenseTypes(axiosPrivate, controller, setError);
        isMounted && setExpenseTypes(response);
        setLoading(false);
    };

    const setCreatedExpenseTypeAndRefreshExpenseTypes = (newExpenseType) => {
        setCreatedExpenseType(newExpenseType);
        getExpenseTypes();
    };

    const setSavedExpenseTypeAndRefreshExpenseTypes = (savedEditedExpenseType) => {
        setSavedExpenseType(savedEditedExpenseType);
        getExpenseTypes();
    };

    // get expense types data from api
    useEffect(() => {
        getExpenseTypes();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const expenseTypeSuccessfullyCreatedToast = (
            <SuccessToast message={`Expense type ${createdExpenseType?.name} has been created successfully`} />
        );

        if (createdExpenseType?.name) {
            setToast(expenseTypeSuccessfullyCreatedToast);
        }
    }, [createdExpenseType]);

    useEffect(() => {
        const expenseTypeSuccessfullyEditedToast = (
            <SuccessToast message={`Expense type ${savedExpenseType?.name} has been updated successfully`} />
        );

        if (savedExpenseType?.name) {
            setToast(expenseTypeSuccessfullyEditedToast);
        }
    }, [savedExpenseType]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewExpenseTypeModal(!isVisibleNewExpenseTypeModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Expense Type" /> Add New Expense Type
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={expenseTypes}
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
                            ? `Could not retrieve expense types due to ${error}. Please try again.`
                            : 'No expense types found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={item}
                                setSelectedItem={setSelectedExpenseType}
                                isVisibleEditModal={isVisibleEditExpenseTypeModal}
                                setIsVisibleEditModal={setIsVisibleEditExpenseTypeModal}
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
            {isVisibleNewExpenseTypeModal && (
                <NewExpenseTypeForm
                    visibility={isVisibleNewExpenseTypeModal}
                    setExpenseTypeModalVisibility={setIsVisibleNewExpenseTypeModal}
                    createdExpenseTypeCallBack={setCreatedExpenseTypeAndRefreshExpenseTypes}
                />
            )}
            {isVisibleEditExpenseTypeModal && (
                <EditExpenseTypeForm
                    expenseType={selectedExpenseType}
                    visibility={isVisibleEditExpenseTypeModal}
                    setEditExpenseTypeModalVisibility={setIsVisibleEditExpenseTypeModal}
                    savedExpenseTypeCallBack={setSavedExpenseTypeAndRefreshExpenseTypes}
                />
            )}
            <CToaster ref={expenseTypeActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
