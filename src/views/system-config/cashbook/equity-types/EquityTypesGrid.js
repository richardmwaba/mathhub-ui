/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import EquityTypesService from 'src/api/system-config/cashbook/equity-types.service';
import { SuccessToast } from 'src/components/common/SuccessToast';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import { EditButton } from 'src/components/common/EditButton';
import NewEquityTypeForm from './NewEquityTypeForm';
import EditEquityTypeForm from './EditEquityTypeForm';

export default function EquityTypesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [createdEquityType, setCreatedEquityType] = useState({});
    const [isMounted, setIsMounted] = useState(true);
    const [equityTypes, setEquityTypes] = useState([]);
    const [isVisibleEditEquityTypeModal, setIsVisibleEditEquityTypeModal] = useState(false);
    const [isVisibleNewEquityTypeModal, setIsVisibleNewEquityTypeModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedEquityType, setSavedEquityType] = useState({});
    const [error, setError] = useState('');
    const [selectedEquityType, setSelectedEquityType] = useState([]);
    const [toast, setToast] = useState(0);

    const equityTypeActionSuccessToasterRef = useRef();

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

    const getEquityTypes = async () => {
        const response = await EquityTypesService.getAllEquityTypes(
            axiosPrivate,
            controller,
            setError,
        );
        isMounted && setEquityTypes(response);
        setLoading(false);
    };

    const setCreatedEquityTypeAndRefreshEquityTypes = (newEquityType) => {
        setCreatedEquityType(newEquityType);
        getEquityTypes();
    };

    const setSavedEquityTypeAndRefreshEquityTypes = (savedEditedEquityType) => {
        setSavedEquityType(savedEditedEquityType);
        getEquityTypes();
    };

    // get equity types data from api
    useEffect(() => {
        getEquityTypes();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const equityTypeSuccessfullyCreatedToast = (
            <SuccessToast
                message={`Equity type ${createdEquityType?.name} has been created successfully`}
            />
        );

        if (createdEquityType?.name) {
            setToast(equityTypeSuccessfullyCreatedToast);
        }
    }, [createdEquityType]);

    useEffect(() => {
        const equityTypeSuccessfullyEditedToast = (
            <SuccessToast
                message={`Equity type ${savedEquityType?.name} has been updated successfully`}
            />
        );

        if (savedEquityType?.name) {
            setToast(equityTypeSuccessfullyEditedToast);
        }
    }, [savedEquityType]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewEquityTypeModal(!isVisibleNewEquityTypeModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Equity Type" /> Add New Equity Type
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={equityTypes}
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
                            ? `Could not retrieve equity types due to ${error}. Please try again.`
                            : 'No equity types found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={item}
                                setSelectedItem={setSelectedEquityType}
                                isVisibleEditModal={isVisibleEditEquityTypeModal}
                                setIsVisibleEditModal={setIsVisibleEditEquityTypeModal}
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
            {isVisibleNewEquityTypeModal && (
                <NewEquityTypeForm
                    visibility={isVisibleNewEquityTypeModal}
                    setEquityTypeModalVisibility={setIsVisibleNewEquityTypeModal}
                    createdEquityTypeCallBack={setCreatedEquityTypeAndRefreshEquityTypes}
                />
            )}
            {isVisibleEditEquityTypeModal && (
                <EditEquityTypeForm
                    equityType={selectedEquityType}
                    visibility={isVisibleEditEquityTypeModal}
                    setEditEquityTypeModalVisibility={setIsVisibleEditEquityTypeModal}
                    savedEquityTypeCallBack={setSavedEquityTypeAndRefreshEquityTypes}
                />
            )}
            <CToaster ref={equityTypeActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
