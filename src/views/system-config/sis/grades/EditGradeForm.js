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
import GradesService from 'src/api/sis/grades.service';

export default function EditGradeForm({
    grade,
    visibility,
    setEditGradeModalVisibility,
    savedGradeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const gradeNameRef = useRef();
    const errorRef = useRef();
    const defaultGrade = {
        gradeId: grade.id,
        gradeName: grade.name,
        gradeDescription: grade.description,
    };

    const [isEditGradeFormValidated, setIsEditGradeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedGrade, setEditedGrade] = useState(defaultGrade);

    useEffect(() => {
        gradeNameRef.current.focus();
    }, [gradeNameRef]);

    const handleEditGrade = async (event) => {
        const editGradeForm = event.currentTarget;

        if (editGradeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await GradesService.editGrade(
                editedGrade,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedGrade(defaultGrade);
                    setEditGradeModalVisibility(!visibility);
                    savedGradeCallBack(response);
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
        setIsEditGradeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditGradeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Grade</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the grade. Please try
                                            again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditGradeFormValidated}
                                        onSubmit={handleEditGrade}
                                        id="editGradeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Grade Name"
                                            autoComplete="off"
                                            id="gradeName"
                                            label="Name"
                                            required
                                            ref={gradeNameRef}
                                            value={editedGrade.gradeName}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setEditedGrade((prev) => {
                                                    return {
                                                        ...prev,
                                                        gradeName: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Grade Description"
                                            autoComplete="off"
                                            id="gradeDescription"
                                            label="Description"
                                            required
                                            value={editedGrade.gradeDescription}
                                            onChange={(e) => {
                                                setEditedGrade((prev) => {
                                                    return {
                                                        ...prev,
                                                        gradeDescription: e.target.value,
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
                <CButton color="secondary" onClick={() => setEditGradeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="editGradeForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Grade
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditGradeForm.propTypes = {
    grade: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditGradeModalVisibility: PropTypes.func.isRequired,
    savedGradeCallBack: PropTypes.func.isRequired,
};
