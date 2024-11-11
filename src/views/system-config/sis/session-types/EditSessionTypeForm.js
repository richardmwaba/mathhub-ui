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

export default function EditSessionTypeForm({
    sessionType,
    visibility,
    setEditSessionTypeModalVisibility,
    savedSessionTypeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const sessionTypeNameRef = useRef();
    const errorRef = useRef();
    const defaultSessionType = {
        id: sessionType.id,
        name: sessionType.name,
        description: sessionType.description,
    };

    const [isEditSessionTypeFormValidated, setIsEditSessionTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedSessionType, setEditedSessionType] = useState(defaultSessionType);

    useEffect(() => {
        sessionTypeNameRef.current.focus();
    }, [sessionTypeNameRef]);

    const handleEditSessionType = async (event) => {
        const editSessionTypeForm = event.currentTarget;

        if (editSessionTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await SessionTypesService.editSessionType(
                editedSessionType,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedSessionType(defaultSessionType);
                    setEditSessionTypeModalVisibility(!visibility);
                    savedSessionTypeCallBack(response);
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
        setIsEditSessionTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditSessionTypeModalVisibility(!visibility)}
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
                                            An error occured while saving the session type. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditSessionTypeFormValidated}
                                        onSubmit={handleEditSessionType}
                                        id="editSessionTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Session Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={sessionTypeNameRef}
                                            value={editedSessionType.name}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setEditedSessionType((prev) => {
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
                                            value={editedSessionType.description}
                                            onChange={(e) => {
                                                setEditedSessionType((prev) => {
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
                <CButton color="secondary" onClick={() => setEditSessionTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="editSessionTypeForm" loading={isLoading} type="submit">
                    Save Session Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditSessionTypeForm.propTypes = {
    sessionType: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditSessionTypeModalVisibility: PropTypes.func.isRequired,
    savedSessionTypeCallBack: PropTypes.func.isRequired,
};
