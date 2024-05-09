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
    CInputGroup,
    CInputGroupText,
    CFormLabel,
    CDatePicker,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import LessonRatesService from 'src/api/system-config/sis/lesson-rates.service';
import SubjectsService from 'src/api/sis/subjects.service';
import moment from 'moment/moment';
import DateUtils from 'src/utils/dateUtils';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';

export default function NewLessonRateForm({
    visibility,
    setLessonRateModalVisibility,
    createdLessonRateCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const errorRef = useRef();
    const defaultLessonRate = {
        amountPerLesson: '',
        effectiveDate: '',
        subjectComplexity: '',
        expiryDate: '',
    };

    const [subjectComplexities, setSubjectComplexities] = useState([]);
    const [isCreateLessonRateFormValidated, setIsCreateLessonRateFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newLessonRate, setNewLessonRate] = useState(defaultLessonRate);

    useEffect(() => {
        setSubjectComplexities(SubjectsService.getAllSubjectComplexities());
    }, []);

    // set the value of expiry date to one year from the effective date
    useEffect(() => {
        if (newLessonRate.effectiveDate) {
            const effectiveDate = moment(newLessonRate.effectiveDate);
            const expiryDate = DateUtils.addOneYearToDate(effectiveDate);
            setNewLessonRate((prev) => {
                return {
                    ...prev,
                    expiryDate: expiryDate,
                };
            });
        }
    }, [newLessonRate.effectiveDate]);

    const handleCreateNewLessonRate = async (event) => {
        const newLessonRateForm = event.currentTarget;

        if (newLessonRateForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await LessonRatesService.createLessonRate(
                newLessonRate,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setNewLessonRate(defaultLessonRate);
                    setLessonRateModalVisibility(!visibility);
                    createdLessonRateCallBack(response);
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
        setIsCreateLessonRateFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setLessonRateModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Lesson Rate</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new lesson rate.
                                            Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateLessonRateFormValidated}
                                        onSubmit={handleCreateNewLessonRate}
                                        id="createNewLessonRateForm"
                                    >
                                        <CFormLabel>Amount Per Lesson</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>ZMW</CInputGroupText>
                                            <CFormInputWithMask
                                                mask={parseFloat}
                                                placeholder="Amount per lesson"
                                                autoComplete="off"
                                                id="amountPerLesson"
                                                required
                                                type="number"
                                                value={newLessonRate.amountPerLesson}
                                                aria-describedby="amountPerLessonInputGroup"
                                                onChange={(e) => {
                                                    setNewLessonRate((prev) => {
                                                        return {
                                                            ...prev,
                                                            amountPerLesson: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CDatePicker
                                            className="mb-3"
                                            closeOnSelect
                                            label="Effective Date"
                                            firstDayOfWeek={0} // Sunday
                                            inputDateFormat={(selectedDate) => {
                                                return DateUtils.formatDate(selectedDate);
                                            }}
                                            timepicker
                                            required
                                            date={newLessonRate.effectiveDate}
                                            onDateChange={(selectedDate) => {
                                                setNewLessonRate((prev) => {
                                                    return {
                                                        ...prev,
                                                        effectiveDate: selectedDate,
                                                    };
                                                });
                                            }}
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
                                            date={newLessonRate.expiryDate}
                                            onDateChange={(selectedDate) => {
                                                setNewLessonRate((prev) => {
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
                                            placeholder="Select subject complexity..."
                                            value={newLessonRate.subjectComplexity}
                                            required
                                            valid={newLessonRate.subjectComplexity !== ''}
                                            feedbackInvalid="Please select a valid subject complexity"
                                            onChange={(e) => {
                                                setNewLessonRate((prev) => {
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
                <CButton color="secondary" onClick={() => setLessonRateModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="createNewLessonRateForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Lesson Rate
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewLessonRateForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setLessonRateModalVisibility: PropTypes.func.isRequired,
    createdLessonRateCallBack: PropTypes.func.isRequired,
};
