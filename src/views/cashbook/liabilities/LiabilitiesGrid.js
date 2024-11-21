/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import CIcon from '@coreui/icons-react';
import NewLiabilityForm from './NewLiabilityForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditLiabilityForm from './EditLiabilityForm';
import { GridEditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';
import LiabilitiesService from 'src/api/cashbook/liabilities.service';

export default function LiabilitiesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [liabilities, setLiabilities] = useState([]);
    const [createdLiability, setCreatedLiability] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditLiabilityModal, setIsVisibleEditLiabilityModal] = useState(false);
    const [isVisibleNewLiabilityModal, setIsVisibleNewLiabilityModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedLiability, setSavedLiability] = useState({});
    const [selectedLiability, setSelectedLiability] = useState({});
    const [toast, setToast] = useState(0);

    const liabilityActionSuccessToasterRef = useRef();

    const columns = [
        { key: 'narration', label: 'Name', _style: { width: '30%' } },
        {
            key: 'type',
            label: 'Liability Type',
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

    const getLiabilities = async () => {
        const response = await LiabilitiesService.getAllLiabilities(axiosPrivate, controller, setError);
        isMounted && setLiabilities(response);
        setLoading(false);
    };

    const setCreatedLiabilityAndRefreshLiabilities = (newLiability) => {
        setCreatedLiability(newLiability);
        getLiabilities();
    };

    const setSavedLiabilityAndRefreshLiabilities = (savedEditedLiability) => {
        setSavedLiability(savedEditedLiability);
        getLiabilities();
    };

    const formatLiabilities = (liabilitiesList) => {
        return liabilitiesList.map((liability) => {
            return {
                id: liability.id,
                narration: liability.narration,
                type: liability.type.name,
                amount: liability.amount,
                paymentMethod: liability.paymentMethod.name,
                createdBy: liability.createdBy,
            };
        });
    };

    // get liability types data from api
    useEffect(() => {
        getLiabilities();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const liabilitySuccessfullyCreatedToast = (
            <SuccessToast message={'New liability has been created successfully'} />
        );

        if (createdLiability?.narration) {
            setToast(liabilitySuccessfullyCreatedToast);
        }
    }, [createdLiability]);

    useEffect(() => {
        const liabilitySuccessfullyEditedToast = <SuccessToast message={'Liability has been updated successfully'} />;

        if (savedLiability?.narration) {
            setToast(liabilitySuccessfullyEditedToast);
        }
    }, [savedLiability]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewLiabilityModal(!isVisibleNewLiabilityModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Liability" /> Add New Liability
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={formatLiabilities(liabilities)}
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
                            ? `Could not retrieve liabilities due to ${error}. Please try again.`
                            : 'No liabilities found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <GridEditButton
                                item={liabilities.find((liability) => liability.id === item.id)}
                                setSelectedItem={setSelectedLiability}
                                isVisibleEditModal={isVisibleEditLiabilityModal}
                                setIsVisibleEditModal={setIsVisibleEditLiabilityModal}
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
            {isVisibleNewLiabilityModal && (
                <NewLiabilityForm
                    visibility={isVisibleNewLiabilityModal}
                    setLiabilityModalVisibility={setIsVisibleNewLiabilityModal}
                    createdLiabilityCallBack={setCreatedLiabilityAndRefreshLiabilities}
                />
            )}
            {isVisibleEditLiabilityModal && (
                <EditLiabilityForm
                    liability={selectedLiability}
                    visibility={isVisibleEditLiabilityModal}
                    setEditLiabilityModalVisibility={setIsVisibleEditLiabilityModal}
                    savedLiabilityCallBack={setSavedLiabilityAndRefreshLiabilities}
                />
            )}
            <CToaster ref={liabilityActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
