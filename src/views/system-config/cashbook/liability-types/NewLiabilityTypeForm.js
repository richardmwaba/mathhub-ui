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
import LiabilityTypesService from 'src/api/system-config/cashbook/liability-types.service';

export default function NewLiabilityTypeForm({
    visibility,
    setLiabilityTypeModalVisibility,
    createdLiabilityTypeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const liabilityTypeNameRef = useRef();
    const errorRef = useRef();
    const defaultLiabilityType = {
        name: '',
        description: '',
    };

    const [isCreateLiabilityTypeFormValidated, setIsCreateLiabilityTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newLiabilityType, setNewLiabilityType] = useState(defaultLiabilityType);

    useEffect(() => {
        liabilityTypeNameRef.current.focus();
    }, []);

    const handleCreateNewLiabilityType = async (event) => {
        const newLiabilityTypeForm = event.currentTarget;

        if (newLiabilityTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await LiabilityTypesService.createLiabilityType(
                newLiabilityType,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setNewLiabilityType(defaultLiabilityType);
                    setLiabilityTypeModalVisibility(!visibility);
                    createdLiabilityTypeCallBack(response);
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
        setIsCreateLiabilityTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setLiabilityTypeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Liability Type</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new liability type. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateLiabilityTypeFormValidated}
                                        onSubmit={handleCreateNewLiabilityType}
                                        id="createNewLiabilityTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Liability Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={liabilityTypeNameRef}
                                            value={newLiabilityType.name}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setNewLiabilityType((prev) => {
                                                    return {
                                                        ...prev,
                                                        name: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Liability Type Description"
                                            autoComplete="off"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={newLiabilityType.description}
                                            onChange={(e) => {
                                                setNewLiabilityType((prev) => {
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
                <CButton color="secondary" onClick={() => setLiabilityTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="createNewLiabilityTypeForm" loading={isLoading} type="submit">
                    Save Liability Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewLiabilityTypeForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setLiabilityTypeModalVisibility: PropTypes.func.isRequired,
    createdLiabilityTypeCallBack: PropTypes.func.isRequired,
};
