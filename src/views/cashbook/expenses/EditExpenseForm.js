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
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';
import ExpenseTypesService from 'src/api/system-config/cashbook/expense-types.service';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';

export default function EditExpenseForm({ expense, visibility, setEditExpenseModalVisibility, savedExpenseCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const expenseNameRef = useRef();
    const errorRef = useRef();
    const defaultExpense = {
        id: expense.id,
        narration: expense.narration,
        expenseTypeId: expense.type.id,
        paymentMethodId: expense.paymentMethod.id,
        amount: `${expense.amount}`,
    };

    const [isMounted, setIsMounted] = useState(true);
    const [allExpenseTypes, setAllExpenseTypes] = useState([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState([]);
    const [isEditExpenseFormValidated, setIsEditExpenseFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedExpense, setEditedExpense] = useState(defaultExpense);

    useEffect(() => {
        expenseNameRef.current.focus();
    }, [expenseNameRef]);

    const getExpenseTypes = async () => {
        const expenseTypes = await ExpenseTypesService.getAllExpenseTypes(axiosPrivate, controller, setErrorMessage);
        const allExpenseTypes = expenseTypes.map((expenseType) => {
            return { value: expenseType.id, label: expenseType.name };
        });
        isMounted && setAllExpenseTypes(allExpenseTypes);
    };

    const expenseTypesWithPlaceholder = (expenseTypes) => {
        return [{ value: '', label: 'Select expense type...' }, ...expenseTypes];
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

    const handleEditExpense = async (event) => {
        const editExpenseForm = event.currentTarget;

        if (editExpenseForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await ExpensesService.editExpense(editedExpense, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setEditedExpense(defaultExpense);
                    setEditExpenseModalVisibility(!visibility);
                    savedExpenseCallBack(response);
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
        setIsEditExpenseFormValidated(true);
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
            onClose={() => setEditExpenseModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Edit Expense</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the expense type. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditExpenseFormValidated}
                                        onSubmit={handleEditExpense}
                                        id="editExpenseForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Enter name"
                                            autoComplete="off"
                                            id="name"
                                            label="Name"
                                            required
                                            ref={expenseNameRef}
                                            value={editedExpense.narration}
                                            onChange={(e) => {
                                                setEditedExpense((prev) => {
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
                                            options={expenseTypesWithPlaceholder(allExpenseTypes)}
                                            id="expenseType"
                                            label="Type"
                                            required
                                            value={editedExpense.expenseTypeId}
                                            onChange={(e) => {
                                                setEditedExpense((prev) => {
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
                                                value={editedExpense.amount}
                                                onChange={(e) => {
                                                    setEditedExpense((prev) => {
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
                                            value={editedExpense.paymentMethodId}
                                            onChange={(e) => {
                                                setEditedExpense((prev) => {
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
                <CButton color="secondary" onClick={() => setEditExpenseModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="editExpenseForm" loading={isLoading} type="submit">
                    Save Expense
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditExpenseForm.propTypes = {
    expense: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditExpenseModalVisibility: PropTypes.func.isRequired,
    savedExpenseCallBack: PropTypes.func.isRequired,
};
