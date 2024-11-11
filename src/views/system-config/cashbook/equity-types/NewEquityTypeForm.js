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
import EquityTypesService from 'src/api/system-config/cashbook/equity-types.service';

export default function NewEquityTypeForm({ visibility, setEquityTypeModalVisibility, createdEquityTypeCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const equityTypeNameRef = useRef();
    const errorRef = useRef();
    const defaultEquityType = {
        name: '',
        description: '',
    };

    const [isCreateEquityTypeFormValidated, setIsCreateEquityTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newEquityType, setNewEquityType] = useState(defaultEquityType);

    useEffect(() => {
        equityTypeNameRef.current.focus();
    }, []);

    const handleCreateNewEquityType = async (event) => {
        const newEquityTypeForm = event.currentTarget;

        if (newEquityTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await EquityTypesService.createEquityType(newEquityType, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setNewEquityType(defaultEquityType);
                    setEquityTypeModalVisibility(!visibility);
                    createdEquityTypeCallBack(response);
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
        setIsCreateEquityTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEquityTypeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Equity Type</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new equity type. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateEquityTypeFormValidated}
                                        onSubmit={handleCreateNewEquityType}
                                        id="createNewEquityTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Equity Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={equityTypeNameRef}
                                            value={newEquityType.name}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setNewEquityType((prev) => {
                                                    return {
                                                        ...prev,
                                                        name: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Equity Type Description"
                                            autoComplete="off"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={newEquityType.description}
                                            onChange={(e) => {
                                                setNewEquityType((prev) => {
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
                <CButton color="secondary" onClick={() => setEquityTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="createNewEquityTypeForm" loading={isLoading} type="submit">
                    Save Equity Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewEquityTypeForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setEquityTypeModalVisibility: PropTypes.func.isRequired,
    createdEquityTypeCallBack: PropTypes.func.isRequired,
};
