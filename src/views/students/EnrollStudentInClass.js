/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CLoadingButton,
    CFormText,
    CFormSelect,
    CCardHeader,
    CListGroup,
    CListGroupItem,
    CFormInput,
    CInputGroup,
    CFormLabel,
    CDatePicker,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import StudentsService from 'src/api/sis/students.service';
import SubjectsService from 'src/api/sis/subjects.service';
import CIcon from '@coreui/icons-react';
import { cilCart, cilTrash } from '@coreui/icons';
import EnrolledClassService from 'src/api/sis/classes.service';
import DateUtils from 'src/utils/dateUtils';
import { isEmpty } from 'lodash';

export default function EnrollStudentInClass({
    student,
    visibility,
    setIsVisibleEnrollInClassModal,
    completedEnrolmentCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const subjectNameRef = useRef();
    const errorRef = useRef();
    const defaultClass = {
        occurrence: 1,
        subjectId: '',
        subjectName: '',
        startDate: '',
        duration: 1,
        period: '',
        sessionType: '',
    };

    const [isEnrollInClassFormValidated, setIsEnrollInClassFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(true);
    const [isValidEnrolment, setIsValidEnrolment] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newClassEnrolment, setNewClassEnrolment] = useState(defaultClass);
    const [enrolmentCartItems, setEnrolmentCartItems] = useState([]);
    const [applicableSubjects, setApplicableSubjects] = useState([]);

    const subjectsWithSelectPlaceholder = (subjects) => {
        return [{ value: '', label: 'Select subject ...' }, ...subjects];
    };

    const getApplicableSubjects = async () => {
        const subjects = await SubjectsService.getAllSubjects(
            axiosPrivate,
            controller,
            setErrorMessage,
            student.gradeName,
        );
        const allSubjects = subjects.map((subject) => {
            return { value: subject.id, label: subject.name };
        });
        isMounted && setApplicableSubjects(subjectsWithSelectPlaceholder(allSubjects));
    };

    const handleAddToCart = (event) => {
        const enrollInClassForm = event.currentTarget;

        if (enrollInClassForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setIsEnrollInClassFormValidated(true);
        } else {
            event.preventDefault();
            setEnrolmentCartItems((prev) => prev.concat([newClassEnrolment]));
            setNewClassEnrolment(defaultClass);
            setApplicableSubjects(
                applicableSubjects.filter((subject) => subject.value !== newClassEnrolment.subjectId),
            );
            setIsEnrollInClassFormValidated(false);
        }
    };

    const handleRemoveFromCart = (subject) => {
        const applicableSucjectsWithoutSelect = applicableSubjects.filter((subject) => subject.value !== '');
        const updatedApplicableSubjects = applicableSucjectsWithoutSelect
            .concat([{ value: subject.subjectId, label: subject.subjectName }])
            .toSorted((a, b) => a.label.localeCompare(b.label));

        setEnrolmentCartItems(enrolmentCartItems.filter((enrolment) => enrolment.subjectId !== subject.subjectId));
        setApplicableSubjects(subjectsWithSelectPlaceholder(updatedApplicableSubjects));
    };

    const handleCompleteEnrolment = async (event) => {
        if (isValidEnrolment) {
            await StudentsService.enrollStudentInClasses(
                student.id,
                enrolmentCartItems,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setIsVisibleEnrollInClassModal(!visibility);
                    completedEnrolmentCallBack(response);
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
        setIsEnrollInClassFormValidated(true);
    };

    useEffect(() => {
        subjectNameRef.current.focus();
    }, [subjectNameRef]);

    useEffect(() => {
        isEmpty(enrolmentCartItems) ? setIsValidEnrolment(false) : setIsValidEnrolment(true);
    }, [enrolmentCartItems]);

    useEffect(() => {
        getApplicableSubjects();

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
            onClose={() => setIsVisibleEnrollInClassModal(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Enroll {student.firstName} in a class</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={8} lg={8} xl={8}>
                            <CCard className="mx-2">
                                <CCardHeader>Class Details</CCardHeader>
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while enrolling. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEnrollInClassFormValidated}
                                        onSubmit={handleAddToCart}
                                        id="enrollInClassForm"
                                    >
                                        <CCol className="mb-3">
                                            <CFormSelect
                                                label="Subject"
                                                options={applicableSubjects}
                                                placeholder="Select subject..."
                                                value={newClassEnrolment.subjectId}
                                                required
                                                ref={subjectNameRef}
                                                feedbackInvalid="Please select a valid subject complexity"
                                                onChange={(e) => {
                                                    setNewClassEnrolment((prev) => {
                                                        return {
                                                            ...prev,
                                                            subjectId: e.target.value,
                                                            subjectName: applicableSubjects.find(
                                                                (subject) => subject.value === e.target.value,
                                                            ).label,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CCol>
                                        <CCol className="mb-3">
                                            <CFormInput
                                                placeholder="Occurences"
                                                autoComplete="off"
                                                id="occurences"
                                                label="Occurences (number of lessons)"
                                                required
                                                value={newClassEnrolment.occurrence}
                                                feedbackInvalid="Number of occurences be equal to 1 or greater"
                                                onChange={(e) => {
                                                    setNewClassEnrolment((prev) => {
                                                        return {
                                                            ...prev,
                                                            occurrence: e.target.value,
                                                        };
                                                    });
                                                }}
                                                min={1}
                                                type="number"
                                            />
                                        </CCol>
                                        <CFormLabel htmlFor="duration">Duration</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CCol xs="3" sm="3" md="3" lg={3} xl={3}>
                                                <CFormInput
                                                    className="rounded-0"
                                                    id="duration"
                                                    value={newClassEnrolment.duration}
                                                    onChange={(e) => {
                                                        setNewClassEnrolment((prev) => {
                                                            return {
                                                                ...prev,
                                                                duration: e.target.value,
                                                            };
                                                        });
                                                    }}
                                                    min={1}
                                                    type="number"
                                                />
                                            </CCol>
                                            <CFormSelect
                                                options={EnrolledClassService.getEnrolledClassPeriods()}
                                                placeholder="Select period..."
                                                value={newClassEnrolment.period}
                                                required
                                                ref={subjectNameRef}
                                                feedbackInvalid="Please select a valid period"
                                                onChange={(e) => {
                                                    setNewClassEnrolment((prev) => {
                                                        return {
                                                            ...prev,
                                                            period: e.target.value,
                                                            sessionType: EnrolledClassService.getSessionType(
                                                                newClassEnrolment.duration,
                                                                e.target.value,
                                                            ),
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CDatePicker
                                            className="mb-3"
                                            closeOnSelect
                                            label="Start Date"
                                            id="startDate"
                                            firstDayOfWeek={0} // Sunday
                                            required
                                            inputDateFormat={(selectedDate) => {
                                                return DateUtils.formatDate(selectedDate, 'DD MMM YYYY');
                                            }}
                                            date={newClassEnrolment.startDate}
                                            minDate={new Date()}
                                            onDateChange={(selectedDate) => {
                                                setNewClassEnrolment((prev) => {
                                                    return {
                                                        ...prev,
                                                        startDate: selectedDate,
                                                    };
                                                });
                                            }}
                                        />
                                    </CForm>
                                    <CButton
                                        color="primary"
                                        variant="outline"
                                        form="enrollInClassForm"
                                        size="sm"
                                        type="submit"
                                    >
                                        <CIcon icon={cilCart} title="Add class" /> Add to Cart
                                    </CButton>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol md={4} lg={4} xl={4}>
                            <EnrolmentCart
                                enrolmentCartItems={enrolmentCartItems}
                                handleRemoveFromCart={handleRemoveFromCart}
                            />
                        </CCol>
                    </CRow>
                </CContainer>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setIsVisibleEnrollInClassModal(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    loading={isLoading}
                    type="submit"
                    onClick={handleCompleteEnrolment}
                    disabled={!isValidEnrolment}
                >
                    Complete Enrolment
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EnrollStudentInClass.propTypes = {
    student: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setIsVisibleEnrollInClassModal: PropTypes.func.isRequired,
    completedEnrolmentCallBack: PropTypes.func.isRequired,
};

export const EnrolmentCart = ({ enrolmentCartItems, handleRemoveFromCart }) => {
    return (
        <CCard>
            <CCardHeader>
                <CIcon icon={cilCart} /> Cart
            </CCardHeader>
            <CCardBody>
                <CListGroup flush>
                    {enrolmentCartItems.map((enrolment) => {
                        return (
                            <CListGroupItem
                                key={enrolment.subjectId}
                                className="fw-semibold"
                                style={{ paddingLeft: 0, paddingRight: 0 }}
                            >
                                {enrolment.subjectName}
                                <sup>
                                    {enrolment.duration} {enrolment.period}
                                </sup>
                                <span style={{ cursor: 'pointer', float: 'right' }}>
                                    <CIcon
                                        className="text-danger"
                                        onClick={() => handleRemoveFromCart(enrolment)}
                                        icon={cilTrash}
                                        title={`Remove ${enrolment.subjectName}`}
                                    />
                                </span>
                            </CListGroupItem>
                        );
                    })}
                </CListGroup>
            </CCardBody>
        </CCard>
    );
};

EnrolmentCart.propTypes = {
    enrolmentCartItems: PropTypes.array.isRequired,
    handleRemoveFromCart: PropTypes.func.isRequired,
};
