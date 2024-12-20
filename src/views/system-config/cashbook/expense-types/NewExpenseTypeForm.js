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
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import ExpenseTypesService from 'src/api/system-config/cashbook/expense-types.service';

export default function NewExpenseTypeForm({ visibility, setExpenseTypeModalVisibility, createdExpenseTypeCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const expenseTypeNameRef = useRef();
    const errorRef = useRef();
    const defaultExpenseType = {
        name: '',
        description: '',
    };

    const [isCreateExpenseTypeFormValidated, setIsCreateExpenseTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newExpenseType, setNewExpenseType] = useState(defaultExpenseType);

    useEffect(() => {
        expenseTypeNameRef.current.focus();
    }, []);

    const handleCreateNewExpenseType = async (event) => {
        const newExpenseTypeForm = event.currentTarget;

        if (newExpenseTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await ExpenseTypesService.createExpenseType(newExpenseType, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setNewExpenseType(defaultExpenseType);
                    setExpenseTypeModalVisibility(!visibility);
                    createdExpenseTypeCallBack(response);
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
        setIsCreateExpenseTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setExpenseTypeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Expense Type</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new expense type. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateExpenseTypeFormValidated}
                                        onSubmit={handleCreateNewExpenseType}
                                        id="createNewExpenseTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Expense Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={expenseTypeNameRef}
                                            value={newExpenseType.name}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setNewExpenseType((prev) => {
                                                    return {
                                                        ...prev,
                                                        name: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Expense Type Description"
                                            autoComplete="off"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={newExpenseType.description}
                                            onChange={(e) => {
                                                setNewExpenseType((prev) => {
                                                    return {
                                                        ...prev,
                                                        description: e.target.value,
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
                <CButton color="secondary" onClick={() => setExpenseTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="createNewExpenseTypeForm" loading={isLoading} type="submit">
                    Save Expense Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewExpenseTypeForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setExpenseTypeModalVisibility: PropTypes.func.isRequired,
    createdExpenseTypeCallBack: PropTypes.func.isRequired,
};
