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
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';
import IncomeTypesService from 'src/api/system-config/cashbook/income-types.service';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';

export default function EditIncomeForm({ income, visibility, setEditIncomeModalVisibility, savedIncomeCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const incomeNameRef = useRef();
    const errorRef = useRef();
    const defaultIncome = {
        id: income.id,
        narration: income.narration,
        incomeTypeId: income.type.id,
        paymentMethodId: income.paymentMethod.id,
        amount: `${income.amount}`,
    };

    const [isMounted, setIsMounted] = useState(true);
    const [allIncomeTypes, setAllIncomeTypes] = useState([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState([]);
    const [isEditIncomeFormValidated, setIsEditIncomeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedIncome, setEditedIncome] = useState(defaultIncome);

    useEffect(() => {
        incomeNameRef.current.focus();
    }, [incomeNameRef]);

    const getIncomeTypes = async () => {
        const incomeTypes = await IncomeTypesService.getAllIncomeTypes(axiosPrivate, controller, setErrorMessage);
        const allIncomeTypes = incomeTypes.map((incomeType) => {
            return { value: incomeType.id, label: incomeType.name };
        });
        isMounted && setAllIncomeTypes(allIncomeTypes);
    };

    const incomeTypesWithPlaceholder = (incomeTypes) => {
        return [{ value: '', label: 'Select income type...' }, ...incomeTypes];
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
        isMounted && setAllPaymentMethods(allPaymentMethods);
    };

    const paymentMethodsWithPlaceholder = (paymentMethods) => {
        return [{ value: '', label: 'Select payment method...' }, ...paymentMethods];
    };

    const handleEditIncome = async (event) => {
        const editIncomeForm = event.currentTarget;

        if (editIncomeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await IncomesService.editIncome(editedIncome, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setEditedIncome(defaultIncome);
                    setEditIncomeModalVisibility(!visibility);
                    savedIncomeCallBack(response);
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
        setIsEditIncomeFormValidated(true);
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
            onClose={() => setEditIncomeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Edit Income</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the income type. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditIncomeFormValidated}
                                        onSubmit={handleEditIncome}
                                        id="editIncomeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Enter name"
                                            autoComplete="off"
                                            id="name"
                                            label="Name"
                                            required
                                            ref={incomeNameRef}
                                            value={editedIncome.narration}
                                            onChange={(e) => {
                                                setEditedIncome((prev) => {
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
                                            options={incomeTypesWithPlaceholder(allIncomeTypes)}
                                            id="incomeType"
                                            label="Type"
                                            required
                                            value={editedIncome.incomeTypeId}
                                            onChange={(e) => {
                                                setEditedIncome((prev) => {
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
                                                value={editedIncome.amount}
                                                onChange={(e) => {
                                                    setEditedIncome((prev) => {
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
                                            options={paymentMethodsWithPlaceholder(allPaymentMethods)}
                                            id="paymentMethod"
                                            label="Payment Method"
                                            required
                                            value={editedIncome.paymentMethodId}
                                            onChange={(e) => {
                                                setEditedIncome((prev) => {
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
                <CButton color="secondary" onClick={() => setEditIncomeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="editIncomeForm" loading={isLoading} type="submit">
                    Save Income
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditIncomeForm.propTypes = {
    income: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditIncomeModalVisibility: PropTypes.func.isRequired,
    savedIncomeCallBack: PropTypes.func.isRequired,
};
