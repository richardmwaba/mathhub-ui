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
import AssessmentTypesService from 'src/api/system-config/sis/assessment-types.service';

export default function NewAssessmentTypeForm({
    visibility,
    setAssessmentTypeModalVisibility,
    createdAssessmentTypeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const typeNameRef = useRef();
    const errorRef = useRef();
    const defaultAssessmentType = {
        typeName: '',
        typeDescription: '',
    };

    const [isCreateAssessmentTypeFormValidated, setIsCreateAssessmentTypeFormValidated] =
        useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newAssessmentType, setNewAssessmentType] = useState(defaultAssessmentType);

    useEffect(() => {
        typeNameRef.current.focus();
    }, []);

    const handleCreateNewAssessmentType = async (event) => {
        const newAssessmentTypeForm = event.currentTarget;

        if (newAssessmentTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await AssessmentTypesService.createAssessmentType(
                newAssessmentType,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setNewAssessmentType(defaultAssessmentType);
                    setAssessmentTypeModalVisibility(!visibility);
                    createdAssessmentTypeCallBack(response);
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
        setIsCreateAssessmentTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setAssessmentTypeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Assessment Type</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new assessment type.
                                            Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateAssessmentTypeFormValidated}
                                        onSubmit={handleCreateNewAssessmentType}
                                        id="createNewAssessmentTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={typeNameRef}
                                            value={newAssessmentType.typeName}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setNewAssessmentType((prev) => {
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
                                            value={newAssessmentType.typeDescription}
                                            onChange={(e) => {
                                                setNewAssessmentType((prev) => {
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
                <CButton color="secondary" onClick={() => setAssessmentTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="createNewAssessmentTypeForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Assessment Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewAssessmentTypeForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setAssessmentTypeModalVisibility: PropTypes.func.isRequired,
    createdAssessmentTypeCallBack: PropTypes.func.isRequired,
};
