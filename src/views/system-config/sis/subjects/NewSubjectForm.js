/* eslint-disable react-hooks/exhaustive-deps */
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
    CFormSelect,
    CMultiSelect,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import SubjectsService from 'src/api/sis/subjects.service';
import GradesService from 'src/api/sis/grades.service';

export default function NewSubjectForm({ visibility, setSubjectModalVisibility, createdSubjectCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const subjectNameRef = useRef();
    const errorRef = useRef();
    const defaultSubject = {
        name: '',
        gradeIds: [],
        complexity: '',
    };

    const [allGrades, setAllGrades] = useState([]);
    const [subjectComplexities, setSubjectComplexities] = useState([]);
    const [isCreateSubjectFormValidated, setIsCreateSubjectFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [newSubject, setNewSubject] = useState(defaultSubject);

    const getGrades = async () => {
        const grades = await GradesService.getAllGrades(axiosPrivate, controller, setErrorMessage);
        const allGrades = grades.map((grade) => {
            return { value: grade.id, label: grade.name };
        });
        isMounted && setAllGrades(allGrades);
    };

    useEffect(() => {
        subjectNameRef.current.focus();
    }, []);

    useEffect(() => {
        getGrades();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        setSubjectComplexities(SubjectsService.getAllSubjectComplexities());
    }, []);

    const handleCreateNewSubject = async (event) => {
        const newSubjectForm = event.currentTarget;

        if (newSubjectForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await SubjectsService.createSubject(newSubject, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setNewSubject(defaultSubject);
                    setSubjectModalVisibility(!visibility);
                    createdSubjectCallBack(response);
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
        setIsCreateSubjectFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setSubjectModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Subject</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new subject. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateSubjectFormValidated}
                                        onSubmit={handleCreateNewSubject}
                                        id="createNewSubjectForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Subject Name"
                                            autoComplete="off"
                                            id="subjectName"
                                            label="Name"
                                            required
                                            ref={subjectNameRef}
                                            value={newSubject.name}
                                            aria-describedby="subjectNameInputGroup"
                                            onChange={(e) => {
                                                setNewSubject((prev) => {
                                                    return {
                                                        ...prev,
                                                        name: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CMultiSelect
                                            className="mb-3"
                                            label="Grades"
                                            options={allGrades}
                                            placeholder="Select grades..."
                                            required
                                            feedbackInvalid="Select at least one grade"
                                            onChange={(selectedGrades) => {
                                                setNewSubject((prev) => {
                                                    const selectedGradesValues = selectedGrades.map((selectedGrade) => {
                                                        return selectedGrade.value;
                                                    });
                                                    return {
                                                        ...prev,
                                                        gradeIds: selectedGradesValues,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormSelect
                                            className="mb-3"
                                            label="Complexity"
                                            options={subjectComplexities}
                                            placeholder="Select subject complexity..."
                                            required
                                            onChange={(e) => {
                                                setNewSubject((prev) => {
                                                    return {
                                                        ...prev,
                                                        complexity: e.target.value,
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
                <CButton color="secondary" onClick={() => setSubjectModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="createNewSubjectForm" loading={isLoading} type="submit">
                    Save Subject
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewSubjectForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setSubjectModalVisibility: PropTypes.func.isRequired,
    createdSubjectCallBack: PropTypes.func.isRequired,
};
