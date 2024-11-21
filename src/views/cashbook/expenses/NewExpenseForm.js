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
import ExpensesService from 'src/api/cashbook/expenses.service';
import ExpenseTypesService from 'src/api/system-config/cashbook/expense-types.service';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';

export default function NewExpenseForm({ visibility, setExpenseModalVisibility, createdExpenseCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const expenseNameRef = useRef();
    const errorRef = useRef();
    const defaultExpense = {
        narration: '',
        expenseTypeId: '',
        paymentMethodId: '',
        amount: '',
    };

    const [isMounted, setIsMounted] = useState(true);
    const [allExpenseTypes, setAllExpenseTypes] = useState([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState([]);
    const [isCreateExpenseFormValidated, setIsCreateExpenseFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newExpense, setNewExpense] = useState(defaultExpense);

    useEffect(() => {
        expenseNameRef.current.focus();
    }, []);

    const getExpenseTypes = async () => {
        const expenseTypes = await ExpenseTypesService.getAllExpenseTypes(axiosPrivate, controller, setErrorMessage);
        const allExpenseTypes = expenseTypes.map((expenseType) => {
            return { value: expenseType.id, label: expenseType.name };
        });
        const expenseTypesWithPlaceholder = [{ value: '', label: 'Select expense type...' }, ...allExpenseTypes];
        isMounted && setAllExpenseTypes(expenseTypesWithPlaceholder);
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

    const handleCreateNewExpense = async (event) => {
        const newExpenseForm = event.currentTarget;

        if (newExpenseForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await ExpensesService.createExpense(newExpense, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setNewExpense(defaultExpense);
                    setExpenseModalVisibility(!visibility);
                    createdExpenseCallBack(response);
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
        setIsCreateExpenseFormValidated(true);
    };

    useEffect(() => {
        getExpenseTypes();

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
            onClose={() => setExpenseModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Expense</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new expense. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateExpenseFormValidated}
                                        onSubmit={handleCreateNewExpense}
                                        id="createNewExpenseForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Enter name"
                                            autoComplete="off"
                                            id="name"
                                            label="Name"
                                            required
                                            ref={expenseNameRef}
                                            value={newExpense.narration}
                                            onChange={(e) => {
                                                setNewExpense((prev) => {
                                                    return {
                                                        ...prev,
                                                        narration: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select expense type..."
                                            autoComplete="off"
                                            options={allExpenseTypes}
                                            id="expenseType"
                                            label="Type"
                                            required
                                            value={newExpense.expenseTypeId}
                                            onChange={(e) => {
                                                setNewExpense((prev) => {
                                                    return {
                                                        ...prev,
                                                        expenseTypeId: e.target.value,
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
                                                value={newExpense.amount}
                                                onChange={(e) => {
                                                    setNewExpense((prev) => {
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
                                            value={newExpense.paymentMethodId}
                                            onChange={(e) => {
                                                setNewExpense((prev) => {
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
                <CButton color="secondary" onClick={() => setExpenseModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="createNewExpenseForm" loading={isLoading} type="submit">
                    Save Expense
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewExpenseForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setExpenseModalVisibility: PropTypes.func.isRequired,
    createdExpenseCallBack: PropTypes.func.isRequired,
};
