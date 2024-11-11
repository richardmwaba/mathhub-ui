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
    CDatePicker,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import StudentsService from 'src/api/sis/students.service';
import UsersService from 'src/api/system-config/users/users.service';
import GradesService from 'src/api/sis/grades.service';
import ExamBoardsService from 'src/api/sis/exam-boards.service';
import DateUtils from 'src/utils/dateUtils';
import moment from 'moment';

export default function EditStudentBasicInfo({
    student,
    visibility,
    setEditStudentModalVisibility,
    savedStudentCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const studentNameRef = useRef();
    const errorRef = useRef();
    const defaultStudent = {
        id: student.id,
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        gradeId: student.grade.id,
        examBoardId: student.examBoard.id,
    };

    const [isEditStudentFormValidated, setIsEditStudentFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedStudent, setEditedStudent] = useState(defaultStudent);
    const [genderOptions, setGenderOptions] = useState([]);
    const [allGrades, setAllGrades] = useState([]);
    const [allExamBoards, setAllExamBoards] = useState([]);

    const getGrades = async () => {
        const grades = await GradesService.getAllGrades(axiosPrivate, controller, setErrorMessage);

        const allGrades = grades
            .map((grade) => {
                if (editedStudent.gradeId === grade.id) {
                    return {
                        value: grade.id,
                        label: grade.name,
                        selected: true,
                    };
                }
                return { value: grade.id, label: grade.name };
            })
            .sort((a, b) => a.label - b.label);
        isMounted && setAllGrades(allGrades);
    };

    const getExamBoards = async () => {
        const examBoards = await ExamBoardsService.getAllExamBoards(axiosPrivate, controller, setErrorMessage);

        const allExamBoards = examBoards
            .map((examBoard) => {
                if (editedStudent.examBoardId === examBoard.id) {
                    return {
                        value: examBoard.id,
                        label: examBoard.name,
                        selected: true,
                    };
                }
                return { value: examBoard.id, label: examBoard.name };
            })
            .sort((a, b) => a.label - b.label);
        isMounted && setAllExamBoards(allExamBoards);
    };

    const handleEditStudent = async (event) => {
        const editStudentForm = event.currentTarget;

        if (editStudentForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await StudentsService.editStudent(editedStudent, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setEditedStudent(defaultStudent);
                    setEditStudentModalVisibility(!visibility);
                    savedStudentCallBack(response);
                    console.log(response);
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
        setIsEditStudentFormValidated(true);
    };

    useEffect(() => {
        studentNameRef.current.focus();
    }, [studentNameRef]);

    useEffect(() => {
        setGenderOptions(() => {
            return UsersService.getGenderOptions().map((genderOption) => {
                if (editedStudent.gender === genderOption.value) {
                    return {
                        value: genderOption.value,
                        label: genderOption.label,
                        selected: true,
                    };
                }

                return genderOption;
            });
        });
    }, []);

    useEffect(() => {
        getGrades();
        getExamBoards();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditStudentModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Edit {student.firstName}&rsquo;s Basic Info</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the student. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditStudentFormValidated}
                                        onSubmit={handleEditStudent}
                                        id="editStudentForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Student's First Name"
                                            autoComplete="off"
                                            id="firstName"
                                            label="First Name"
                                            required
                                            ref={studentNameRef}
                                            value={editedStudent.firstName}
                                            aria-describedby="firstNameInputGroup"
                                            onChange={(e) => {
                                                setEditedStudent((prev) => {
                                                    return {
                                                        ...prev,
                                                        firstName: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Student's Middle Name"
                                            autoComplete="off"
                                            id="middleName"
                                            label="Middle Name"
                                            value={editedStudent.middleName}
                                            aria-describedby="middleNameInputGroup"
                                            onChange={(e) => {
                                                setEditedStudent((prev) => {
                                                    return {
                                                        ...prev,
                                                        middleName: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Student's Last Name"
                                            autoComplete="off"
                                            id="lastName"
                                            label="Last Name"
                                            required
                                            value={editedStudent.lastName}
                                            onChange={(e) => {
                                                setEditedStudent((prev) => {
                                                    return {
                                                        ...prev,
                                                        lastName: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CDatePicker
                                            className="mb-3"
                                            closeOnSelect
                                            label="Date of Birth"
                                            firstDayOfWeek={0} // Sunday
                                            maxDate={moment().subtract(7, 'years').toDate()}
                                            required
                                            inputDateFormat={(selectedDate) => {
                                                return DateUtils.formatDate(selectedDate, 'DD MMM YYYY');
                                            }}
                                            date={editedStudent.dateOfBirth}
                                            onDateChange={(selectedDate) => {
                                                setEditedStudent((prev) => {
                                                    return {
                                                        ...prev,
                                                        dateOfBirth: selectedDate,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select gender..."
                                            autoComplete="off"
                                            label="Gender"
                                            options={genderOptions}
                                            id="gender"
                                            required
                                            feedbackInvalid="Select valid gender."
                                            value={editedStudent.gender}
                                            onChange={(e) => {
                                                setEditedStudent((prev) => {
                                                    return {
                                                        ...prev,
                                                        gender: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select grade..."
                                            autoComplete="off"
                                            label="Grade"
                                            options={allGrades}
                                            id="grade"
                                            required
                                            feedbackInvalid="Select a grade."
                                            value={editedStudent.gradeId}
                                            onChange={(selectedGrade) => {
                                                setEditedStudent((prev) => {
                                                    return {
                                                        ...prev,
                                                        gradeId: selectedGrade.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select exam board..."
                                            autoComplete="off"
                                            label="Exam Board"
                                            options={allExamBoards}
                                            id="examBoard"
                                            required
                                            feedbackInvalid="Select an examboard option."
                                            value={editedStudent.examBoardId}
                                            onChange={(selectedExamBoard) => {
                                                setEditedStudent((prev) => {
                                                    return {
                                                        ...prev,
                                                        examBoardId: selectedExamBoard.value,
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
                <CButton color="secondary" onClick={() => setEditStudentModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="editStudentForm" loading={isLoading} type="submit">
                    Save
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditStudentBasicInfo.propTypes = {
    student: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditStudentModalVisibility: PropTypes.func.isRequired,
    savedStudentCallBack: PropTypes.func.isRequired,
};
