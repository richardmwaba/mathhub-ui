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
import ClassRatesService from 'src/api/system-config/sis/class-rates.service';
import SubjectsService from 'src/api/sis/subjects.service';
import moment from 'moment/moment';
import DateUtils from 'src/utils/dateUtils';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';

export default function NewClassRateForm({ visibility, setClassRateModalVisibility, createdClassRateCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const errorRef = useRef();
    const defaultClassRate = {
        amount: '',
        effectiveDate: '',
        subjectComplexity: '',
        expiryDate: '',
    };

    const [subjectComplexities, setSubjectComplexities] = useState([]);
    const [isCreateClassRateFormValidated, setIsCreateClassRateFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newClassRate, setNewClassRate] = useState(defaultClassRate);

    useEffect(() => {
        setSubjectComplexities(SubjectsService.getAllSubjectComplexities());
    }, []);

    // set the value of expiry date to one year from the effective date
    useEffect(() => {
        if (newClassRate.effectiveDate) {
            const effectiveDate = moment(newClassRate.effectiveDate);
            const expiryDate = DateUtils.addOneYearToDate(effectiveDate);
            setNewClassRate((prev) => {
                return {
                    ...prev,
                    expiryDate: expiryDate,
                };
            });
        }
    }, [newClassRate.effectiveDate]);

    const handleCreateNewClassRate = async (event) => {
        const newClassRateForm = event.currentTarget;

        if (newClassRateForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await ClassRatesService.createclassRate(newClassRate, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setNewClassRate(defaultClassRate);
                    setClassRateModalVisibility(!visibility);
                    createdClassRateCallBack(response);
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
        setIsCreateClassRateFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setClassRateModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Class Rate</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new class rate. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateClassRateFormValidated}
                                        onSubmit={handleCreateNewClassRate}
                                        id="createNewClassRateForm"
                                    >
                                        <CFormLabel>Amount Per Class</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>ZMW</CInputGroupText>
                                            <CFormInputWithMask
                                                mask={parseFloat}
                                                placeholder="Amount per class"
                                                autoComplete="off"
                                                id="amountPerClass"
                                                required
                                                type="number"
                                                value={newClassRate.amount}
                                                aria-describedby="amountPerClassInputGroup"
                                                onChange={(e) => {
                                                    setNewClassRate((prev) => {
                                                        return {
                                                            ...prev,
                                                            amount: e.target.value,
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
                                            date={newClassRate.effectiveDate}
                                            onDateChange={(selectedDate) => {
                                                setNewClassRate((prev) => {
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
                                            date={newClassRate.expiryDate}
                                            onDateChange={(selectedDate) => {
                                                setNewClassRate((prev) => {
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
                                            value={newClassRate.subjectComplexity}
                                            required
                                            valid={newClassRate.subjectComplexity !== ''}
                                            feedbackInvalid="Please select a valid subject complexity"
                                            onChange={(e) => {
                                                setNewClassRate((prev) => {
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
                <CButton color="secondary" onClick={() => setClassRateModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="createNewClassRateForm" loading={isLoading} type="submit">
                    Save Class Rate
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewClassRateForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setClassRateModalVisibility: PropTypes.func.isRequired,
    createdClassRateCallBack: PropTypes.func.isRequired,
};
