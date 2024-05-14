/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import CIcon from '@coreui/icons-react';
import NewEquityForm from './NewEquityForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditEquityForm from './EditEquityForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';
import EquitiesService from 'src/api/cashbook/equities.service';

export default function EquitiesGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [equities, setEquities] = useState([]);
    const [createdEquity, setCreatedEquity] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditEquityModal, setIsVisibleEditEquityModal] = useState(false);
    const [isVisibleNewEquityModal, setIsVisibleNewEquityModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedEquity, setSavedEquity] = useState({});
    const [selectedEquity, setSelectedEquity] = useState({});
    const [toast, setToast] = useState(0);

    const equityActionSuccessToasterRef = useRef();

    const columns = [
        { key: 'narration', label: 'Name', _style: { width: '30%' } },
        {
            key: 'equityType',
            label: 'Equity Type',
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

    const getEquities = async () => {
        const response = await EquitiesService.getAllEquity(axiosPrivate, controller, setError);
        isMounted && setEquities(response);
        setLoading(false);
    };

    const setCreatedEquityAndRefreshEquities = (newEquity) => {
        setCreatedEquity(newEquity);
        getEquities();
    };

    const setSavedEquityAndRefreshEquities = (savedEditedEquity) => {
        setSavedEquity(savedEditedEquity);
        getEquities();
    };

    const formatEquities = (equitiesList) => {
        return equitiesList.map((equity) => {
            return {
                id: equity.id,
                narration: equity.narration,
                equityType: equity.equityType.typeName,
                amount: equity.amount,
                paymentMethod: equity.paymentMethod.typeName,
                createdBy: equity.createdBy,
            };
        });
    };

    // get equity types data from api
    useEffect(() => {
        getEquities();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const equitySuccessfullyCreatedToast = (
            <SuccessToast message={'New equity has been created successfully'} />
        );

        if (createdEquity?.narration) {
            setToast(equitySuccessfullyCreatedToast);
        }
    }, [createdEquity]);

    useEffect(() => {
        const equitySuccessfullyEditedToast = (
            <SuccessToast message={'Equity has been updated successfully'} />
        );

        if (savedEquity?.narration) {
            setToast(equitySuccessfullyEditedToast);
        }
    }, [savedEquity]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewEquityModal(!isVisibleNewEquityModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Equity" /> Add New Equity
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={formatEquities(equities)}
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
                            ? `Could not retrieve equities due to ${error}. Please try again.`
                            : 'No equities found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={equities.find((equity) => equity.id === item.id)}
                                setSelectedItem={setSelectedEquity}
                                isVisibleEditModal={isVisibleEditEquityModal}
                                setIsVisibleEditModal={setIsVisibleEditEquityModal}
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
            {isVisibleNewEquityModal && (
                <NewEquityForm
                    visibility={isVisibleNewEquityModal}
                    setEquityModalVisibility={setIsVisibleNewEquityModal}
                    createdEquityCallBack={setCreatedEquityAndRefreshEquities}
                />
            )}
            {isVisibleEditEquityModal && (
                <EditEquityForm
                    equity={selectedEquity}
                    visibility={isVisibleEditEquityModal}
                    setEditEquityModalVisibility={setIsVisibleEditEquityModal}
                    savedEquityCallBack={setSavedEquityAndRefreshEquities}
                />
            )}
            <CToaster ref={equityActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
