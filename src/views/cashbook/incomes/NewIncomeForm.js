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
import IncomesService from 'src/api/cashbook/incomes.service';
import IncomeTypesService from 'src/api/system-config/cashbook/income-types.service';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';

export default function NewIncomeForm({
    visibility,
    setIncomeModalVisibility,
    createdIncomeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const incomeNameRef = useRef();
    const errorRef = useRef();
    const defaultIncome = {
        narration: '',
        incomeTypeId: '',
        paymentMethodId: '',
        amount: '',
    };

    const [isMounted, setIsMounted] = useState(true);
    const [allIncomeTypes, setAllIncomeTypes] = useState([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState([]);
    const [isCreateIncomeFormValidated, setIsCreateIncomeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newIncome, setNewIncome] = useState(defaultIncome);

    useEffect(() => {
        incomeNameRef.current.focus();
    }, []);

    const getIncomeTypes = async () => {
        const incomeTypes = await IncomeTypesService.getAllIncomeTypes(
            axiosPrivate,
            controller,
            setErrorMessage,
        );
        const allIncomeTypes = incomeTypes.map((incomeType) => {
            return { value: incomeType.id, label: incomeType.name };
        });
        const incomeTypesWithPlaceholder = [
            { value: '', label: 'Select income type...' },
            ...allIncomeTypes,
        ];
        isMounted && setAllIncomeTypes(incomeTypesWithPlaceholder);
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
        const paymentMethodsWithPlaceholder = [
            { value: '', label: 'Select payment method...' },
            ...allPaymentMethods,
        ];
        isMounted && setAllPaymentMethods(paymentMethodsWithPlaceholder);
    };

    const handleCreateNewIncome = async (event) => {
        const newIncomeForm = event.currentTarget;

        if (newIncomeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await IncomesService.createIncome(
                newIncome,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setNewIncome(defaultIncome);
                    setIncomeModalVisibility(!visibility);
                    createdIncomeCallBack(response);
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
        setIsCreateIncomeFormValidated(true);
    };

    useEffect(() => {
        getIncomeTypes();

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
            onClose={() => setIncomeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Income</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new income. Please try
                                            again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateIncomeFormValidated}
                                        onSubmit={handleCreateNewIncome}
                                        id="createNewIncomeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Enter name"
                                            autoComplete="off"
                                            id="name"
                                            label="Name"
                                            required
                                            ref={incomeNameRef}
                                            value={newIncome.narration}
                                            onChange={(e) => {
                                                setNewIncome((prev) => {
                                                    return {
                                                        ...prev,
                                                        narration: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select income type..."
                                            autoComplete="off"
                                            options={allIncomeTypes}
                                            id="incomeType"
                                            label="Type"
                                            required
                                            value={newIncome.incomeTypeId}
                                            onChange={(e) => {
                                                setNewIncome((prev) => {
                                                    return {
                                                        ...prev,
                                                        incomeTypeId: e.target.value,
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
                                                value={newIncome.amount}
                                                onChange={(e) => {
                                                    setNewIncome((prev) => {
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
                                            value={newIncome.paymentMethodId}
                                            onChange={(e) => {
                                                setNewIncome((prev) => {
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
                <CButton color="secondary" onClick={() => setIncomeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="createNewIncomeForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Income
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewIncomeForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setIncomeModalVisibility: PropTypes.func.isRequired,
    createdIncomeCallBack: PropTypes.func.isRequired,
};
