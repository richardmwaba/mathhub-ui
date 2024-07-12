/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import CIcon from '@coreui/icons-react';
import NewExpenseForm from './NewExpenseForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditExpenseForm from './EditExpenseForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';
import ExpensesService from 'src/api/cashbook/expenses.service';

export default function ExpensesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [expenses, setExpenses] = useState([]);
    const [createdExpense, setCreatedExpense] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditExpenseModal, setIsVisibleEditExpenseModal] = useState(false);
    const [isVisibleNewExpenseModal, setIsVisibleNewExpenseModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedExpense, setSavedExpense] = useState({});
    const [selectedExpense, setSelectedExpense] = useState({});
    const [toast, setToast] = useState(0);

    const expenseActionSuccessToasterRef = useRef();

    const columns = [
        { key: 'narration', label: 'Name', _style: { width: '30%' } },
        {
            key: 'type',
            label: 'Expense Type',
            _style: { width: '30%' },
        },
        {
            key: 'amount',
            label: 'Amount',
            _style: { width: '20%' },
        },
        {
            key: 'paymentMethod',
            label: 'Pament Method',
            _style: { width: '20%' },
        },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            filter: false,
            sorter: false,
        },
    ];

    const getExpenses = async () => {
        const response = await ExpensesService.getAllExpenses(axiosPrivate, controller, setError);
        isMounted && setExpenses(response);
        setLoading(false);
    };

    const setCreatedExpenseAndRefreshExpenses = (newExpense) => {
        setCreatedExpense(newExpense);
        getExpenses();
    };

    const setSavedExpenseAndRefreshExpenses = (savedEditedExpense) => {
        setSavedExpense(savedEditedExpense);
        getExpenses();
    };

    const formatExpenses = (expensesList) => {
        return expensesList.map((expense) => {
            return {
                id: expense.id,
                narration: expense.narration,
                type: expense.type.name,
                amount: expense.amount,
                paymentMethod: expense.paymentMethod.name,
                createdBy: expense.createdBy,
            };
        });
    };

    // get expense types data from api
    useEffect(() => {
        getExpenses();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const expenseSuccessfullyCreatedToast = <SuccessToast message={'New expense has been created successfully'} />;

        if (createdExpense?.narration) {
            setToast(expenseSuccessfullyCreatedToast);
        }
    }, [createdExpense]);

    useEffect(() => {
        const expenseSuccessfullyEditedToast = <SuccessToast message={'Expense has been updated successfully'} />;

        if (savedExpense?.narration) {
            setToast(expenseSuccessfullyEditedToast);
        }
    }, [savedExpense]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewExpenseModal(!isVisibleNewExpenseModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Expense" /> Add New Expense
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={formatExpenses(expenses)}
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
                        error ? `Could not retrieve expenses due to ${error}. Please try again.` : 'No expenses found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={expenses.find((expense) => expense.id === item.id)}
                                setSelectedItem={setSelectedExpense}
                                isVisibleEditModal={isVisibleEditExpenseModal}
                                setIsVisibleEditModal={setIsVisibleEditExpenseModal}
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
            {isVisibleNewExpenseModal && (
                <NewExpenseForm
                    visibility={isVisibleNewExpenseModal}
                    setExpenseModalVisibility={setIsVisibleNewExpenseModal}
                    createdExpenseCallBack={setCreatedExpenseAndRefreshExpenses}
                />
            )}
            {isVisibleEditExpenseModal && (
                <EditExpenseForm
                    expense={selectedExpense}
                    visibility={isVisibleEditExpenseModal}
                    setEditExpenseModalVisibility={setIsVisibleEditExpenseModal}
                    savedExpenseCallBack={setSavedExpenseAndRefreshExpenses}
                />
            )}
            <CToaster ref={expenseActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
