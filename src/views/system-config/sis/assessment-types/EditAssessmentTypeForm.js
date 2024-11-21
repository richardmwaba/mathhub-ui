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

export default function EditAssessmentTypeForm({
    assessmentType,
    visibility,
    setEditAssessmentTypeModalVisibility,
    savedAssessmentTypeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const assessmentTypeNameRef = useRef();
    const errorRef = useRef();
    const defaultAssessmentType = {
        id: assessmentType.id,
        name: assessmentType.name,
        description: assessmentType.description,
    };

    const [isEditAssessmentTypeFormValidated, setIsEditAssessmentTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedAssessmentType, setEditedAssessmentType] = useState(defaultAssessmentType);

    useEffect(() => {
        assessmentTypeNameRef.current.focus();
    }, [assessmentTypeNameRef]);

    const handleEditAssessmentType = async (event) => {
        const editAssessmentTypeForm = event.currentTarget;

        if (editAssessmentTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await AssessmentTypesService.editAssessmentType(
                editedAssessmentType,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedAssessmentType(defaultAssessmentType);
                    setEditAssessmentTypeModalVisibility(!visibility);
                    savedAssessmentTypeCallBack(response);
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
        setIsEditAssessmentTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditAssessmentTypeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
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
                                            An error occured while saving the assessment type. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditAssessmentTypeFormValidated}
                                        onSubmit={handleEditAssessmentType}
                                        id="editAssessmentTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Assessment Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={assessmentTypeNameRef}
                                            value={editedAssessmentType.name}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setEditedAssessmentType((prev) => {
                                                    return {
                                                        ...prev,
                                                        name: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Assessment Type Description"
                                            autoComplete="off"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={editedAssessmentType.description}
                                            onChange={(e) => {
                                                setEditedAssessmentType((prev) => {
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
                <CButton color="secondary" onClick={() => setEditAssessmentTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="editAssessmentTypeForm" loading={isLoading} type="submit">
                    Save Assessment Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditAssessmentTypeForm.propTypes = {
    assessmentType: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditAssessmentTypeModalVisibility: PropTypes.func.isRequired,
    savedAssessmentTypeCallBack: PropTypes.func.isRequired,
};
