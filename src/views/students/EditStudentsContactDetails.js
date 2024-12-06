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
    CInputGroup,
    CFormLabel,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import StudentsService from 'src/api/sis/students.service';
import countryDialCodes from 'src/assets/iso/country-codes.json';
import { CFormInputWithMask } from '../common/CFormInputWithMask';
import zambianProvinces from 'src/assets/iso/zambian-provinces.json';
import { getCities, privincesOptions } from 'src/components/common/serviceutils';

export default function EditStudentsContactDetails({
    student,
    visibility,
    setEditStudentModalVisibility,
    savedStudentCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const emailRef = useRef();
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
        email: student.email,
        phoneNumber: student.phoneNumber,
        address: student.address,
    };

    const [isEditStudentFormValidated, setIsEditStudentFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedStudent, setEditedStudent] = useState(defaultStudent);

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
        emailRef.current.focus();
    }, [emailRef]);

    useEffect(() => {
        const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setIsValidEmail(EMAIL_REGEX.test(editedStudent.email));
    }, [editedStudent.email]);

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditStudentModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">
                    Edit {student.firstName}&rsquo;s Contact Details
                </CModalTitle>
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
                                        <CCol className="mb-3">
                                            <CFormInput
                                                aria-describedby="emailInputGroup"
                                                placeholder="Email"
                                                autoComplete="off"
                                                id="email"
                                                label="Email"
                                                required
                                                ref={emailRef}
                                                type="email"
                                                value={editedStudent.email}
                                                valid={isValidEmail}
                                                invalid={!!editedStudent.email && !isValidEmail}
                                                feedbackInvalid="Please enter a valid email address."
                                                onChange={(e) => {
                                                    setEditedStudent((prev) => {
                                                        return {
                                                            ...prev,
                                                            email: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CCol>
                                        <CFormLabel htmlFor="phoneNumber">Phone Number</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CCol xs="4" sm="4" md="4">
                                                <CFormSelect
                                                    className="rounded-0"
                                                    id="countryCodes"
                                                    value={editedStudent.phoneNumber?.countryCode ?? '+260'}
                                                    onChange={(e) => {
                                                        setEditedStudent((prev) => {
                                                            return {
                                                                ...prev,
                                                                phoneNumber: {
                                                                    number: prev.phoneNumber?.number ?? '',
                                                                    countryCode: e.target.value,
                                                                    type: prev.phoneNumber?.type ?? 'MOBILE',
                                                                },
                                                            };
                                                        });
                                                    }}
                                                >
                                                    {countryDialCodes.map((countryCode) => {
                                                        return (
                                                            <option
                                                                key={countryCode.name}
                                                                value={countryCode.dial_code}
                                                            >
                                                                {countryCode.flag} {countryCode.dial_code}
                                                            </option>
                                                        );
                                                    })}
                                                </CFormSelect>
                                            </CCol>
                                            <CFormInputWithMask
                                                mask="000 000000"
                                                autoComplete="off"
                                                id="phoneNumber"
                                                value={editedStudent.phoneNumber?.number ?? ''}
                                                onChange={(e) => {
                                                    setEditedStudent((prev) => {
                                                        return {
                                                            ...prev,
                                                            phoneNumber: {
                                                                number: e.target.value,
                                                                countryCode: prev.phoneNumber?.countryCode ?? '+260',
                                                                type: prev.phoneNumber?.type ?? 'MOBILE',
                                                            },
                                                        };
                                                    });
                                                }}
                                                placeholder="Phone Number"
                                            />
                                        </CInputGroup>
                                        <CFormLabel htmlFor="streetAddress">Address</CFormLabel>
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Street address"
                                            autoComplete="off"
                                            id="streetAddress"
                                            value={editedStudent.address.firstAddressLine ?? ''}
                                            aria-describedby="streetAddress"
                                            onChange={(e) => {
                                                setEditedStudent((prev) => {
                                                    return {
                                                        ...prev,
                                                        address: {
                                                            ...prev.address,
                                                            firstAddressLine: e.target.value,
                                                        },
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Apt, suite, etc. (optional)"
                                            autoComplete="off"
                                            id="secondAddressLine"
                                            value={editedStudent.address.secondAddressLine ?? ''}
                                            aria-describedby="secondAddressLine"
                                            onChange={(e) => {
                                                setEditedStudent((prev) => {
                                                    return {
                                                        ...prev,
                                                        address: {
                                                            ...prev.address,
                                                            secondAddressLine: e.target.value,
                                                        },
                                                    };
                                                });
                                            }}
                                        />
                                        <CCol className="mb-3">
                                            <CFormSelect
                                                id="provinces"
                                                value={editedStudent.address.province}
                                                options={privincesOptions()}
                                                aria-describedby="province"
                                                feedbackInvalid="Select valid province."
                                                onChange={(e) => {
                                                    setEditedStudent((prev) => {
                                                        return {
                                                            ...prev,
                                                            address: {
                                                                ...prev.address,
                                                                province: e.target.value,
                                                            },
                                                        };
                                                    });
                                                }}
                                                required
                                            />
                                        </CCol>
                                        <CCol className="mb-3">
                                            <CFormSelect
                                                id="cities"
                                                feedbackInvalid="Select valid city/town."
                                                value={editedStudent.address.city}
                                                aria-describedby="city"
                                                options={getCities(zambianProvinces, editedStudent.address.province)}
                                                onChange={(e) => {
                                                    setEditedStudent((prev) => {
                                                        return {
                                                            ...prev,
                                                            address: {
                                                                ...prev.address,
                                                                city: e.target.value,
                                                            },
                                                        };
                                                    });
                                                }}
                                                required
                                            />
                                        </CCol>
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

EditStudentsContactDetails.propTypes = {
    student: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditStudentModalVisibility: PropTypes.func.isRequired,
    savedStudentCallBack: PropTypes.func.isRequired,
};
