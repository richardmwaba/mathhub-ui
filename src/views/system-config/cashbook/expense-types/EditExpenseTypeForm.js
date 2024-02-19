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

export default function EditExpenseTypeForm({
    expenseType,
    visibility,
    setEditExpenseTypeModalVisibility,
    savedExpenseTypeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const typeNameRef = useRef();
    const errorRef = useRef();
    const defaultExpenseType = {
        expenseTypeId: expenseType.id,
        typeName: expenseType.name,
        typeDescription: expenseType.description,
    };

    const [isEditExpenseTypeFormValidated, setIsEditExpenseTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedExpenseType, setEditedExpenseType] = useState(defaultExpenseType);

    useEffect(() => {
        typeNameRef.current.focus();
    }, [typeNameRef]);

    const handleEditExpenseType = async (event) => {
        const editExpenseTypeForm = event.currentTarget;

        if (editExpenseTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await ExpenseTypesService.editExpenseType(
                editedExpenseType,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedExpenseType(defaultExpenseType);
                    setEditExpenseTypeModalVisibility(!visibility);
                    savedExpenseTypeCallBack(response);
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
        setIsEditExpenseTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditExpenseTypeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
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
                                            An error occured while saving the expense type. Please
                                            try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditExpenseTypeFormValidated}
                                        onSubmit={handleEditExpenseType}
                                        id="editExpenseTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={typeNameRef}
                                            value={editedExpenseType.typeName}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setEditedExpenseType((prev) => {
                                                    return {
                                                        ...prev,
                                                        typeName: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Type Description"
                                            autoComplete="tyepDescription"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={editedExpenseType.typeDescription}
                                            onChange={(e) => {
                                                setEditedExpenseType((prev) => {
                                                    return {
                                                        ...prev,
                                                        typeDescription: e.target.value,
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
                <CButton color="secondary" onClick={() => setEditExpenseTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="editExpenseTypeForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Expense Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditExpenseTypeForm.propTypes = {
    expenseType: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditExpenseTypeModalVisibility: PropTypes.func.isRequired,
    savedExpenseTypeCallBack: PropTypes.func.isRequired,
};
