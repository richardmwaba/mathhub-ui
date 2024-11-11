/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import LiabilityTypesService from 'src/api/system-config/cashbook/liability-types.service';
import CIcon from '@coreui/icons-react';
import NewLiabilityTypeForm from './NewLiabilityTypeForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditLiabilityTypeForm from './EditLiabilityTypeForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';

export default function LiabilityTypesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [liabilityTypes, setLiabilityTypes] = useState([]);
    const [createdLiabilityType, setCreatedLiabilityType] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditLiabilityTypeModal, setIsVisibleEditLiabilityTypeModal] = useState(false);
    const [isVisibleNewLiabilityTypeModal, setIsVisibleNewLiabilityTypeModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedLiabilityType, setSavedLiabilityType] = useState({});
    const [selectedLiabilityType, setSelectedLiabilityType] = useState({});
    const [toast, setToast] = useState(0);

    const liabilityTypeActionSuccessToasterRef = useRef();

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

    const getLiabilityTypes = async () => {
        const response = await LiabilityTypesService.getAllLiabilityTypes(axiosPrivate, controller, setError);
        isMounted && setLiabilityTypes(response);
        setLoading(false);
    };

    const setCreatedLiabilityTypeAndRefreshLiabilityTypes = (newLiabilityType) => {
        setCreatedLiabilityType(newLiabilityType);
        getLiabilityTypes();
    };

    const setSavedLiabilityTypeAndRefreshLiabilityTypes = (savedEditedLiabilityType) => {
        setSavedLiabilityType(savedEditedLiabilityType);
        getLiabilityTypes();
    };

    // get liability types data from api
    useEffect(() => {
        getLiabilityTypes();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const liabilityTypeSuccessfullyCreatedToast = (
            <SuccessToast message={`Liability type ${createdLiabilityType?.name} has been created successfully`} />
        );

        if (createdLiabilityType?.name) {
            setToast(liabilityTypeSuccessfullyCreatedToast);
        }
    }, [createdLiabilityType]);

    useEffect(() => {
        const liabilityTypeSuccessfullyEditedToast = (
            <SuccessToast message={`Liability type ${savedLiabilityType?.name} has been updated successfully`} />
        );

        if (savedLiabilityType?.name) {
            setToast(liabilityTypeSuccessfullyEditedToast);
        }
    }, [savedLiabilityType]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewLiabilityTypeModal(!isVisibleNewLiabilityTypeModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Liability Type" /> Add New Liability Type
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={liabilityTypes}
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
                            ? `Could not retrieve liability types due to ${error}. Please try again.`
                            : 'No liability types found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={item}
                                setSelectedItem={setSelectedLiabilityType}
                                isVisibleEditModal={isVisibleEditLiabilityTypeModal}
                                setIsVisibleEditModal={setIsVisibleEditLiabilityTypeModal}
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
            {isVisibleNewLiabilityTypeModal && (
                <NewLiabilityTypeForm
                    visibility={isVisibleNewLiabilityTypeModal}
                    setLiabilityTypeModalVisibility={setIsVisibleNewLiabilityTypeModal}
                    createdLiabilityTypeCallBack={setCreatedLiabilityTypeAndRefreshLiabilityTypes}
                />
            )}
            {isVisibleEditLiabilityTypeModal && (
                <EditLiabilityTypeForm
                    liabilityType={selectedLiabilityType}
                    visibility={isVisibleEditLiabilityTypeModal}
                    setEditLiabilityTypeModalVisibility={setIsVisibleEditLiabilityTypeModal}
                    savedLiabilityTypeCallBack={setSavedLiabilityTypeAndRefreshLiabilityTypes}
                />
            )}
            <CToaster ref={liabilityTypeActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
