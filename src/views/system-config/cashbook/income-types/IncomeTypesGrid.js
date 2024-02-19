/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import IncomeTypesService from 'src/api/system-config/cashbook/income-types.service';
import CIcon from '@coreui/icons-react';
import NewIncomeTypeForm from './NewIncomeTypeForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditIncomeTypeForm from './EditIncomeTypeForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';

export default function IncomeTypesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [incomeTypes, setIncomeTypes] = useState([]);
    const [createdIncomeType, setCreatedIncomeType] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditIncomeTypeModal, setIsVisibleEditIncomeTypeModal] = useState(false);
    const [isVisibleNewIncomeTypeModal, setIsVisibleNewIncomeTypeModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedIncomeType, setSavedIncomeType] = useState({});
    const [selectedIncomeType, setSelectedIncomeType] = useState({});
    const [toast, setToast] = useState(0);

    const incomeTypeActionSuccessToasterRef = useRef();

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

    const getIncomeTypes = async () => {
        const response = await IncomeTypesService.getAllIncomeTypes(
            axiosPrivate,
            controller,
            setError,
        );
        isMounted && setIncomeTypes(response);
        setLoading(false);
    };

    const setCreatedIncomeTypeAndRefreshIncomeTypes = (newIncomeType) => {
        setCreatedIncomeType(newIncomeType);
        getIncomeTypes();
    };

    const setSavedIncomeTypeAndRefreshIncomeTypes = (savedEditedIncomeType) => {
        setSavedIncomeType(savedEditedIncomeType);
        getIncomeTypes();
    };

    // get income types data from api
    useEffect(() => {
        getIncomeTypes();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const incomeTypeSuccessfullyCreatedToast = (
            <SuccessToast
                message={`Income type ${createdIncomeType?.typeName} has been created successfully`}
            />
        );

        if (createdIncomeType?.typeName) {
            setToast(incomeTypeSuccessfullyCreatedToast);
        }
    }, [createdIncomeType]);

    useEffect(() => {
        const incomeTypeSuccessfullyEditedToast = (
            <SuccessToast
                message={`Income type ${savedIncomeType?.typeName} has been updated successfully`}
            />
        );

        if (savedIncomeType?.typeName) {
            setToast(incomeTypeSuccessfullyEditedToast);
        }
    }, [savedIncomeType]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewIncomeTypeModal(!isVisibleNewIncomeTypeModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Income Type" /> Add New Income Type
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={incomeTypes}
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
                            ? `Could not retrieve income types due to ${error}. Please try again.`
                            : 'No income types found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={item}
                                setSelectedItem={setSelectedIncomeType}
                                isVisibleEditModal={isVisibleEditIncomeTypeModal}
                                setIsVisibleEditModal={setIsVisibleEditIncomeTypeModal}
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
            {isVisibleNewIncomeTypeModal && (
                <NewIncomeTypeForm
                    visibility={isVisibleNewIncomeTypeModal}
                    setIncomeTypeModalVisibility={setIsVisibleNewIncomeTypeModal}
                    createdIncomeTypeCallBack={setCreatedIncomeTypeAndRefreshIncomeTypes}
                />
            )}
            {isVisibleEditIncomeTypeModal && (
                <EditIncomeTypeForm
                    incomeType={selectedIncomeType}
                    visibility={isVisibleEditIncomeTypeModal}
                    setEditIncomeTypeModalVisibility={setIsVisibleEditIncomeTypeModal}
                    savedIncomeTypeCallBack={setSavedIncomeTypeAndRefreshIncomeTypes}
                />
            )}
            <CToaster ref={incomeTypeActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
