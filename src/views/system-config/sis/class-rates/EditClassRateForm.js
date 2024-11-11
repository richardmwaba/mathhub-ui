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
import ClassRatesService from 'src/api/system-config/sis/class-rates.service';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';
import DateUtils from 'src/utils/dateUtils';
import SubjectsService from 'src/api/sis/subjects.service';

export default function EditClassRateForm({
    classRate,
    visibility,
    setEditClassRateModalVisibility,
    savedClassRateCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const errorRef = useRef();
    const defaultClassRate = {
        id: classRate.id,
        amount: classRate.amount,
        effectiveDate: classRate.effectiveDate,
        subjectComplexity: classRate.subjectComplexity,
        expiryDate: classRate.expiryDate,
    };

    const [isEditClassRateFormValidated, setIsEditClassRateFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedClassRate, setEditedClassRate] = useState(defaultClassRate);
    const [subjectComplexities, setSubjectComplexities] = useState([]);

    useEffect(() => {
        setSubjectComplexities(SubjectsService.getAllSubjectComplexities());
    }, []);

    const handleEditClassRate = async (event) => {
        const editClassRateForm = event.currentTarget;

        if (editClassRateForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await ClassRatesService.editClassRate(editedClassRate, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setEditedClassRate(defaultClassRate);
                    setEditClassRateModalVisibility(!visibility);
                    savedClassRateCallBack(response);
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
        setIsEditClassRateFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditClassRateModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Edit Class Rate</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the class rate. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditClassRateFormValidated}
                                        onSubmit={handleEditClassRate}
                                        id="editClassRateForm"
                                    >
                                        <CFormLabel>Amount Per Class</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>ZMW</CInputGroupText>
                                            <CFormInputWithMask
                                                mask={parseFloat}
                                                id="amountPerClass"
                                                disabled
                                                type="number"
                                                value={editedClassRate.amount}
                                                aria-describedby="amountPerClassInputGroup"
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
                                            date={editedClassRate.effectiveDate}
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
                                            date={editedClassRate.expiryDate}
                                            onDateChange={(selectedDate) => {
                                                setEditedClassRate((prev) => {
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
                                            value={editedClassRate.subjectComplexity}
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
                <CButton color="secondary" onClick={() => setEditClassRateModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="editClassRateForm" loading={isLoading} type="submit">
                    Save Class Rate
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditClassRateForm.propTypes = {
    classRate: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditClassRateModalVisibility: PropTypes.func.isRequired,
    savedClassRateCallBack: PropTypes.func.isRequired,
};
