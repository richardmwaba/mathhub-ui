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
import SessionTypesService from 'src/api/system-config/sis/session-types.service';

export default function NewSessionTypeForm({
    visibility,
    setSessionTypeModalVisibility,
    createdSessionTypeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const sessionTypeNameRef = useRef();
    const errorRef = useRef();
    const defaultSessionType = {
        name: '',
        description: '',
    };

    const [isCreateSessionTypeFormValidated, setIsCreateSessionTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newSessionType, setNewSessionType] = useState(defaultSessionType);

    useEffect(() => {
        sessionTypeNameRef.current.focus();
    }, []);

    const handleCreateNewSessionType = async (event) => {
        const newSessionTypeForm = event.currentTarget;

        if (newSessionTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await SessionTypesService.createSessionType(
                newSessionType,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setNewSessionType(defaultSessionType);
                    setSessionTypeModalVisibility(!visibility);
                    createdSessionTypeCallBack(response);
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
        setIsCreateSessionTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setSessionTypeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Session Type</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new session type.
                                            Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateSessionTypeFormValidated}
                                        onSubmit={handleCreateNewSessionType}
                                        id="createNewSessionTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Session Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={sessionTypeNameRef}
                                            value={newSessionType.name}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setNewSessionType((prev) => {
                                                    return {
                                                        ...prev,
                                                        name: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Session Type Description"
                                            autoComplete="off"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={newSessionType.description}
                                            onChange={(e) => {
                                                setNewSessionType((prev) => {
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
                <CButton color="secondary" onClick={() => setSessionTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="createNewSessionTypeForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Session Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewSessionTypeForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setSessionTypeModalVisibility: PropTypes.func.isRequired,
    createdSessionTypeCallBack: PropTypes.func.isRequired,
};
