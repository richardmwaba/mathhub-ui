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
    CFormLabel,
    CInputGroup,
    CInputGroupText,
    CDatePicker,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import LessonRatesService from 'src/api/system-config/sis/lesson-rates.service';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';
import DateUtils from 'src/utils/dateUtils';
import SubjectsService from 'src/api/sis/subjects.service';

export default function EditLessonRateForm({
    lessonRate,
    visibility,
    setEditLessonRateModalVisibility,
    savedLessonRateCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const errorRef = useRef();
    const defaultLessonRate = {
        lessonRateId: lessonRate.id,
        amountPerLesson: lessonRate.amountPerLesson,
        effectiveDate: lessonRate.effectiveDate,
        subjectComplexity: lessonRate.subjectComplexity,
        expiryDate: lessonRate.expiryDate,
    };

    const [isEditLessonRateFormValidated, setIsEditLessonRateFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedLessonRate, setEditedLessonRate] = useState(defaultLessonRate);
    const [subjectComplexities, setSubjectComplexities] = useState([]);

    useEffect(() => {
        setSubjectComplexities(SubjectsService.getAllSubjectComplexities());
    }, []);

    const handleEditLessonRate = async (event) => {
        const editLessonRateForm = event.currentTarget;

        if (editLessonRateForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await LessonRatesService.editLessonRate(
                editedLessonRate,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedLessonRate(defaultLessonRate);
                    setEditLessonRateModalVisibility(!visibility);
                    savedLessonRateCallBack(response);
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
        setIsEditLessonRateFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditLessonRateModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Edit Lesson Rate</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the lesson rate. Please
                                            try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditLessonRateFormValidated}
                                        onSubmit={handleEditLessonRate}
                                        id="editLessonRateForm"
                                    >
                                        <CFormLabel>Amount Per Lesson</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>ZMW</CInputGroupText>
                                            <CFormInputWithMask
                                                mask={parseFloat}
                                                id="amountPerLesson"
                                                disabled
                                                type="number"
                                                value={editedLessonRate.amountPerLesson}
                                                aria-describedby="amountPerLessonInputGroup"
                                            />
                                        </CInputGroup>
                                        <CDatePicker
                                            className="mb-3"
                                            closeOnSelect
                                            label="Effective Date"
                                            firstDayOfWeek={0} // Sunday
                                            timepicker
                                            required
                                            disabled
                                            inputDateFormat={(selectedDate) => {
                                                return DateUtils.formatDate(selectedDate);
                                            }}
                                            date={editedLessonRate.effectiveDate}
                                        />
                                        <CDatePicker
                                            className="mb-3"
                                            closeOnSelect
                                            label="Expiry Date"
                                            firstDayOfWeek={0} // Sunday
                                            inputDateFormat={(selectedDate) => {
                                                return DateUtils.formatDate(selectedDate);
                                            }}
                                            timepicker
                                            required
                                            date={editedLessonRate.expiryDate}
                                            onDateChange={(selectedDate) => {
                                                setEditedLessonRate((prev) => {
                                                    return {
                                                        ...prev,
                                                        expiryDate: selectedDate,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormSelect
                                            className="mb-3"
                                            label="Subject Complexity"
                                            options={subjectComplexities}
                                            value={editedLessonRate.subjectComplexity}
                                            disabled
                                        />
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setEditLessonRateModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="editLessonRateForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Lesson Rate
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditLessonRateForm.propTypes = {
    lessonRate: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditLessonRateModalVisibility: PropTypes.func.isRequired,
    savedLessonRateCallBack: PropTypes.func.isRequired,
};
