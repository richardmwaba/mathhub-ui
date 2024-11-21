/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import CIcon from '@coreui/icons-react';
import NewIncomeForm from './NewIncomeForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditIncomeForm from './EditIncomeForm';
import { GridEditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';
import IncomesService from 'src/api/cashbook/incomes.service';

export default function IncomesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [incomes, setIncomes] = useState([]);
    const [createdIncome, setCreatedIncome] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditIncomeModal, setIsVisibleEditIncomeModal] = useState(false);
    const [isVisibleNewIncomeModal, setIsVisibleNewIncomeModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedIncome, setSavedIncome] = useState({});
    const [selectedIncome, setSelectedIncome] = useState({});
    const [toast, setToast] = useState(0);

    const incomeActionSuccessToasterRef = useRef();

    const columns = [
        { key: 'narration', label: 'Name', _style: { width: '30%' } },
        {
            key: 'type',
            label: 'Income Type',
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

    const getIncomes = async () => {
        const response = await IncomesService.getAllIncomes(axiosPrivate, controller, setError);
        isMounted && setIncomes(response);
        setLoading(false);
    };

    const setCreatedIncomeAndRefreshIncomes = (newIncome) => {
        setCreatedIncome(newIncome);
        getIncomes();
    };

    const setSavedIncomeAndRefreshIncomes = (savedEditedIncome) => {
        setSavedIncome(savedEditedIncome);
        getIncomes();
    };

    const formatIncomes = (incomesList) => {
        return incomesList.map((income) => {
            return {
                id: income.id,
                narration: income.narration,
                type: income.type.name,
                amount: income.amount,
                paymentMethod: income.paymentMethod.name,
                createdBy: income.createdBy,
            };
        });
    };

    // get income types data from api
    useEffect(() => {
        getIncomes();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const incomeSuccessfullyCreatedToast = <SuccessToast message={'New income has been created successfully'} />;

        if (createdIncome?.narration) {
            setToast(incomeSuccessfullyCreatedToast);
        }
    }, [createdIncome]);

    useEffect(() => {
        const incomeSuccessfullyEditedToast = <SuccessToast message={'Income has been updated successfully'} />;

        if (savedIncome?.narration) {
            setToast(incomeSuccessfullyEditedToast);
        }
    }, [savedIncome]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewIncomeModal(!isVisibleNewIncomeModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Income" /> Add New Income
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={formatIncomes(incomes)}
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
                        error ? `Could not retrieve incomes due to ${error}. Please try again.` : 'No incomes found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <GridEditButton
                                item={incomes.find((income) => income.id === item.id)}
                                setSelectedItem={setSelectedIncome}
                                isVisibleEditModal={isVisibleEditIncomeModal}
                                setIsVisibleEditModal={setIsVisibleEditIncomeModal}
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
            {isVisibleNewIncomeModal && (
                <NewIncomeForm
                    visibility={isVisibleNewIncomeModal}
                    setIncomeModalVisibility={setIsVisibleNewIncomeModal}
                    createdIncomeCallBack={setCreatedIncomeAndRefreshIncomes}
                />
            )}
            {isVisibleEditIncomeModal && (
                <EditIncomeForm
                    income={selectedIncome}
                    visibility={isVisibleEditIncomeModal}
                    setEditIncomeModalVisibility={setIsVisibleEditIncomeModal}
                    savedIncomeCallBack={setSavedIncomeAndRefreshIncomes}
                />
            )}
            <CToaster ref={incomeActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
