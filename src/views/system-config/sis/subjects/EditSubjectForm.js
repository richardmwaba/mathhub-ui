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

export default function EditSubjectForm({
    subject,
    visibility,
    setEditSubjectModalVisibility,
    savedSubjectCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const subjectNameRef = useRef();
    const errorRef = useRef();
    const defaultSubject = {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectGradeIds: subject.grades.map((grade) => grade.id),
        subjectComplexity: subject.complexity,
    };

    const [allGrades, setAllGrades] = useState([]);
    const [isEditSubjectFormValidated, setIsEditSubjectFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedSubject, setEditedSubject] = useState(defaultSubject);
    const [subjectComplexities, setSubjectComplexities] = useState([]);

    const getGrades = async () => {
        const grades = await GradesService.getAllGrades(axiosPrivate, controller, setErrorMessage);

        const allGrades = grades
            .map((grade) => {
                if (editedSubject.subjectGradeIds.includes(grade.id)) {
                    return { value: grade.id, label: grade.name, selected: true };
                }
                return { value: grade.id, label: grade.name };
            })
            .sort((a, b) => a.label - b.label);
        isMounted && setAllGrades(allGrades);
    };

    useEffect(() => {
        subjectNameRef.current.focus();
    }, [subjectNameRef]);

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

    const handleEditSubject = async (event) => {
        const editSubjectForm = event.currentTarget;

        if (editSubjectForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await SubjectsService.editSubject(
                editedSubject,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedSubject(defaultSubject);
                    setEditSubjectModalVisibility(!visibility);
                    savedSubjectCallBack(response);
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
        setIsEditSubjectFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditSubjectModalVisibility(!visibility)}
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
                                            An error occured while saving the subject. Please try
                                            again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditSubjectFormValidated}
                                        onSubmit={handleEditSubject}
                                        id="editSubjectForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Subject Name"
                                            autoComplete="off"
                                            id="subjectName"
                                            label="Name"
                                            required
                                            ref={subjectNameRef}
                                            value={editedSubject.subjectName}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setEditedSubject((prev) => {
                                                    return {
                                                        ...prev,
                                                        subjectName: e.target.value,
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
                                                setEditedSubject((prev) => {
                                                    const selectedGradesValues = selectedGrades.map(
                                                        (selectedGrade) => {
                                                            return selectedGrade.value;
                                                        },
                                                    );
                                                    return {
                                                        ...prev,
                                                        subjectGradeIds: selectedGradesValues,
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
                                            value={editedSubject.subjectComplexity}
                                            onChange={(e) => {
                                                setEditedSubject((prev) => {
                                                    return {
                                                        ...prev,
                                                        subjectComplexity: e.target.value,
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
                <CButton color="secondary" onClick={() => setEditSubjectModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="editSubjectForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Subject
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditSubjectForm.propTypes = {
    subject: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditSubjectModalVisibility: PropTypes.func.isRequired,
    savedSubjectCallBack: PropTypes.func.isRequired,
};
