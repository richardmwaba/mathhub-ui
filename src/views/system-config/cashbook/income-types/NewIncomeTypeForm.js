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
import IncomeTypesService from 'src/api/system-config/cashbook/income-types.service';

export default function NewIncomeTypeForm({ visibility, setIncomeTypeModalVisibility, createdIncomeTypeCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const incomeTypeNameRef = useRef();
    const errorRef = useRef();
    const defaultIncomeType = {
        name: '',
        description: '',
    };

    const [isCreateIncomeTypeFormValidated, setIsCreateIncomeTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newIncomeType, setNewIncomeType] = useState(defaultIncomeType);

    useEffect(() => {
        incomeTypeNameRef.current.focus();
    }, []);

    const handleCreateNewIncomeType = async (event) => {
        const newIncomeTypeForm = event.currentTarget;

        if (newIncomeTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await IncomeTypesService.createIncomeType(newIncomeType, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setNewIncomeType(defaultIncomeType);
                    setIncomeTypeModalVisibility(!visibility);
                    createdIncomeTypeCallBack(response);
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
        setIsCreateIncomeTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setIncomeTypeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Income Type</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new income type. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateIncomeTypeFormValidated}
                                        onSubmit={handleCreateNewIncomeType}
                                        id="createNewIncomeTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Income Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={incomeTypeNameRef}
                                            value={newIncomeType.name}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setNewIncomeType((prev) => {
                                                    return {
                                                        ...prev,
                                                        name: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Income Type Description"
                                            autoComplete="off"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={newIncomeType.description}
                                            onChange={(e) => {
                                                setNewIncomeType((prev) => {
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
                <CButton color="secondary" onClick={() => setIncomeTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="createNewIncomeTypeForm" loading={isLoading} type="submit">
                    Save Income Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewIncomeTypeForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setIncomeTypeModalVisibility: PropTypes.func.isRequired,
    createdIncomeTypeCallBack: PropTypes.func.isRequired,
};
