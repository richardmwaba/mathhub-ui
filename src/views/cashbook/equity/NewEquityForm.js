/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CLoadingButton,
    CFormText,
    CFormSelect,
    CFormLabel,
    CInputGroup,
    CInputGroupText,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import EquitiesService from 'src/api/cashbook/equities.service';
import EquityTypesService from 'src/api/system-config/cashbook/equity-types.service';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';

export default function NewEquityForm({ visibility, setEquityModalVisibility, createdEquityCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const equityNameRef = useRef();
    const errorRef = useRef();
    const defaultEquity = {
        narration: '',
        equityTypeId: '',
        paymentMethodId: '',
        amount: '',
    };

    const [isMounted, setIsMounted] = useState(true);
    const [allEquityTypes, setAllEquityTypes] = useState([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState([]);
    const [isCreateEquityFormValidated, setIsCreateEquityFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newEquity, setNewEquity] = useState(defaultEquity);

    useEffect(() => {
        equityNameRef.current.focus();
    }, []);

    const getEquityTypes = async () => {
        const equityTypes = await EquityTypesService.getAllEquityTypes(axiosPrivate, controller, setErrorMessage);
        const allEquityTypes = equityTypes.map((equityType) => {
            return { value: equityType.id, label: equityType.name };
        });
        const equityTypesWithPlaceholder = [{ value: '', label: 'Select equity type...' }, ...allEquityTypes];
        isMounted && setAllEquityTypes(equityTypesWithPlaceholder);
    };

    const paymentMethods = async () => {
        const paymentMethods = await PaymentMethodsService.getAllPaymentMethods(
            axiosPrivate,
            controller,
            setErrorMessage,
        );
        const allPaymentMethods = paymentMethods.map((paymentMethod) => {
            return { value: paymentMethod.id, label: paymentMethod.name };
        });
        const paymentMethodsWithPlaceholder = [{ value: '', label: 'Select payment method...' }, ...allPaymentMethods];
        isMounted && setAllPaymentMethods(paymentMethodsWithPlaceholder);
    };

    const handleCreateNewEquity = async (event) => {
        const newEquityForm = event.currentTarget;

        if (newEquityForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await EquitiesService.createEquity(newEquity, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setNewEquity(defaultEquity);
                    setEquityModalVisibility(!visibility);
                    createdEquityCallBack(response);
                },
                (error) => {
                    if (!error?.response) {
                        setErrorMessage('No server response');
                    }

                    setErrorMessage(error.message);
                    errorRef.current?.focus();
                },
            );
        }

        setIsLoading(false);
        setIsCreateEquityFormValidated(true);
    };

    useEffect(() => {
        getEquityTypes();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        paymentMethods();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEquityModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Equity</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new equity. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateEquityFormValidated}
                                        onSubmit={handleCreateNewEquity}
                                        id="createNewEquityForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Enter name"
                                            autoComplete="off"
                                            id="name"
                                            label="Name"
                                            required
                                            ref={equityNameRef}
                                            value={newEquity.narration}
                                            onChange={(e) => {
                                                setNewEquity((prev) => {
                                                    return {
                                                        ...prev,
                                                        narration: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select equity type..."
                                            autoComplete="off"
                                            options={allEquityTypes}
                                            id="equityType"
                                            label="Type"
                                            required
                                            value={newEquity.equityTypeId}
                                            onChange={(e) => {
                                                setNewEquity((prev) => {
                                                    return {
                                                        ...prev,
                                                        equityTypeId: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormLabel>Amount</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>ZMW</CInputGroupText>
                                            <CFormInputWithMask
                                                mask={parseFloat}
                                                placeholder="Amount"
                                                autoComplete="off"
                                                id="amount"
                                                required
                                                type="number"
                                                value={newEquity.amount}
                                                onChange={(e) => {
                                                    setNewEquity((prev) => {
                                                        return {
                                                            ...prev,
                                                            amount: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select payment method..."
                                            autoComplete="off"
                                            options={allPaymentMethods}
                                            id="paymentMethod"
                                            label="Payment Method"
                                            required
                                            value={newEquity.paymentMethodId}
                                            onChange={(e) => {
                                                setNewEquity((prev) => {
                                                    return {
                                                        ...prev,
                                                        paymentMethodId: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setEquityModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="createNewEquityForm" loading={isLoading} type="submit">
                    Save Equity
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewEquityForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setEquityModalVisibility: PropTypes.func.isRequired,
    createdEquityCallBack: PropTypes.func.isRequired,
};
