/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { CButton, CCardBody, CSmartTable, CToaster } from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';
import CIcon from '@coreui/icons-react';
import NewPaymentMethodForm from './NewPaymentMethodForm';
import { SuccessToast } from 'src/components/common/SuccessToast';
import EditPaymentMethodForm from './EditPaymentMethodForm';
import { EditButton } from 'src/components/common/EditButton';
import { cilPlus } from '@coreui/icons';

export default function PaymentMethodsGrid() {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [createdPaymentMethod, setCreatedPaymentMethod] = useState({});
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [isVisibleEditPaymentMethodModal, setIsVisibleEditPaymentMethodModal] = useState(false);
    const [isVisibleNewPaymentMethodModal, setIsVisibleNewPaymentMethodModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedPaymentMethod, setSavedPaymentMethod] = useState({});
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
    const [toast, setToast] = useState(0);

    const paymentMethodActionSuccessToasterRef = useRef();

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

    const getPaymentMethods = async () => {
        const response = await PaymentMethodsService.getAllPaymentMethods(axiosPrivate, controller, setError);
        isMounted && setPaymentMethods(response);
        setLoading(false);
    };

    const setCreatedPaymentMethodAndRefreshPaymentMethods = (newPaymentMethod) => {
        setCreatedPaymentMethod(newPaymentMethod);
        getPaymentMethods();
    };

    const setSavedPaymentMethodAndRefreshPaymentMethods = (savedEditedPaymentMethod) => {
        setSavedPaymentMethod(savedEditedPaymentMethod);
        getPaymentMethods();
    };

    // get payment methods data from api
    useEffect(() => {
        getPaymentMethods();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const paymentMethodSuccessfullyCreatedToast = (
            <SuccessToast message={`Payment method ${createdPaymentMethod?.name} has been created successfully`} />
        );

        if (createdPaymentMethod?.name) {
            setToast(paymentMethodSuccessfullyCreatedToast);
        }
    }, [createdPaymentMethod]);

    useEffect(() => {
        const paymentMethodSuccessfullyEditedToast = (
            <SuccessToast message={`Payment method ${savedPaymentMethod?.name} has been updated successfully`} />
        );

        if (savedPaymentMethod?.name) {
            setToast(paymentMethodSuccessfullyEditedToast);
        }
    }, [savedPaymentMethod]);

    return (
        <>
            <CCardBody>
                <CButton
                    color="primary"
                    className="mb-2"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisibleNewPaymentMethodModal(!isVisibleNewPaymentMethodModal)}
                >
                    <CIcon icon={cilPlus} title="Add New Asset Type" /> Add New Payment Method
                </CButton>
                <CSmartTable
                    sorterValue={{ column: 'description', state: 'asc' }}
                    items={paymentMethods}
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
                            ? `Could not retrieve payment methods due to ${error}. Please try again.`
                            : 'No payment methods found'
                    }
                    scopedColumns={{
                        show_details: (item) => (
                            <EditButton
                                item={item}
                                setSelectedItem={setSelectedPaymentMethod}
                                isVisibleEditModal={isVisibleEditPaymentMethodModal}
                                setIsVisibleEditModal={setIsVisibleEditPaymentMethodModal}
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
            {isVisibleNewPaymentMethodModal && (
                <NewPaymentMethodForm
                    visibility={isVisibleNewPaymentMethodModal}
                    setPaymentMethodModalVisibility={setIsVisibleNewPaymentMethodModal}
                    createdPaymentMethodCallBack={setCreatedPaymentMethodAndRefreshPaymentMethods}
                />
            )}
            {isVisibleEditPaymentMethodModal && (
                <EditPaymentMethodForm
                    paymentMethod={selectedPaymentMethod}
                    visibility={isVisibleEditPaymentMethodModal}
                    setEditPaymentMethodModalVisibility={setIsVisibleEditPaymentMethodModal}
                    savedPaymentMethodCallBack={setSavedPaymentMethodAndRefreshPaymentMethods}
                />
            )}
            <CToaster ref={paymentMethodActionSuccessToasterRef} push={toast} placement="bottom-end" />
        </>
    );
}
