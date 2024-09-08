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

export default function NewGradeForm({ visibility, setGradeModalVisibility, createdGradeCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const gradeNameRef = useRef();
    const errorRef = useRef();
    const defaultGrade = {
        name: '',
        description: '',
    };

    const [isCreateGradeFormValidated, setIsCreateGradeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newGrade, setNewGrade] = useState(defaultGrade);

    useEffect(() => {
        gradeNameRef.current.focus();
    }, []);

    const handleCreateNewGrade = async (event) => {
        const newGradeForm = event.currentTarget;

        if (newGradeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await GradesService.createGrade(newGrade, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setNewGrade(defaultGrade);
                    setGradeModalVisibility(!visibility);
                    createdGradeCallBack(response);
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
        setIsCreateGradeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setGradeModalVisibility(!visibility)}
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
                                            An error occured while saving the new grade. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateGradeFormValidated}
                                        onSubmit={handleCreateNewGrade}
                                        id="createNewGradeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Grade Name"
                                            autoComplete="off"
                                            id="gradeName"
                                            label="Name"
                                            required
                                            ref={gradeNameRef}
                                            value={newGrade.name}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setNewGrade((prev) => {
                                                    return {
                                                        ...prev,
                                                        name: e.target.value,
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
                                            value={newGrade.description}
                                            onChange={(e) => {
                                                setNewGrade((prev) => {
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
                <CButton color="secondary" onClick={() => setGradeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="createNewGradeForm" loading={isLoading} type="submit">
                    Save Grade
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewGradeForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setGradeModalVisibility: PropTypes.func.isRequired,
    createdGradeCallBack: PropTypes.func.isRequired,
};
