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
    CFormLabel,
    CInputGroup,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import ParentsService from 'src/api/sis/students.service';
import UsersService from 'src/api/system-config/users/users.service';
import countryDialCodes from 'src/assets/iso/country-codes.json';
import { CFormInputWithMask } from '../common/CFormInputWithMask';

export default function EditStudentsParent({
    student,
    visibility,
    setEditParentModalVisibility,
    savedStudentCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const parentNameRef = useRef();
    const errorRef = useRef();
    const defaultStudent = {
        id: student.id,
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        parents: student.parents,
    };
    const defaultParent = defaultStudent.parents[0];

    const [isEditParentFormValidated, setIsEditParentFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedStudent, setEditedStudent] = useState(defaultStudent);
    const [editedParent, setEditedParent] = useState(defaultParent);
    const [genderOptions, setGenderOptions] = useState([]);

    const handleEditParent = async (event) => {
        const editParentForm = event.currentTarget;

        if (editParentForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await ParentsService.editParent(editedParent, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setEditedParent(defaultStudent);
                    setEditParentModalVisibility(!visibility);
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
        setIsEditParentFormValidated(true);
    };

    useEffect(() => {
        parentNameRef.current.focus();
    }, [parentNameRef]);

    useEffect(() => {
        setGenderOptions(() => {
            return UsersService.getGenderOptions().map((genderOption) => {
                if (editedParent.gender === genderOption.value) {
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
        const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setIsValidEmail(EMAIL_REGEX.test(editedParent.email));
    }, [editedParent.email]);

    useEffect(() => {
        const updatedParents = editedStudent.parents.map((parent) =>
            parent.id === editedParent.id ? editedParent : parent,
        );
        setEditedStudent((prev) => {
            return {
                ...prev,
                parents: updatedParents,
            };
        });
    }, [editedParent]);

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditParentModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">
                    Edit {student.firstName}&rsquo;s Parents/Guardians Info
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
                                            An error occured while saving the parent. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditParentFormValidated}
                                        onSubmit={handleEditParent}
                                        id="editParentForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Parent's First Name"
                                            autoComplete="off"
                                            id="firstName"
                                            label="First Name"
                                            required
                                            ref={parentNameRef}
                                            value={editedParent.firstName}
                                            aria-describedby="firstNameInputGroup"
                                            onChange={(e) => {
                                                setEditedParent((prev) => {
                                                    return {
                                                        ...prev,
                                                        firstName: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Parent's Middle Name"
                                            autoComplete="off"
                                            id="middleName"
                                            label="Middle Name"
                                            value={editedParent.middleName}
                                            aria-describedby="middleNameInputGroup"
                                            onChange={(e) => {
                                                setEditedParent((prev) => {
                                                    return {
                                                        ...prev,
                                                        middleName: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Parent's Last Name"
                                            autoComplete="off"
                                            id="lastName"
                                            label="Last Name"
                                            required
                                            value={editedParent.lastName}
                                            onChange={(e) => {
                                                setEditedParent((prev) => {
                                                    return {
                                                        ...prev,
                                                        lastName: e.target.value,
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
                                            value={editedParent.gender}
                                            onChange={(e) => {
                                                setEditedParent((prev) => {
                                                    return {
                                                        ...prev,
                                                        gender: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            aria-describedby="emailInputGroup"
                                            className="mb-3"
                                            placeholder="Parent's Email"
                                            autoComplete="off"
                                            id="email"
                                            label="Email"
                                            required
                                            type="email"
                                            value={editedParent.email}
                                            valid={isValidEmail}
                                            invalid={!!editedParent.email && !isValidEmail}
                                            feedbackInvalid="Please enter a valid email address."
                                            onChange={(e) => {
                                                setEditedParent((prev) => {
                                                    return {
                                                        ...prev,
                                                        email: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormLabel htmlFor="phoneNumber">Phone Number</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CCol xs="4" sm="4" md="4">
                                                <CFormSelect
                                                    className="rounded-0"
                                                    id="countryCodes"
                                                    value={editedParent.phoneNumber?.countryCode ?? '+260'}
                                                    onChange={(e) => {
                                                        setEditedParent((prev) => {
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
                                                autoComplete="phoneNumber"
                                                id="phoneNumber"
                                                value={editedParent.phoneNumber?.number ?? ''}
                                                onChange={(e) => {
                                                    setEditedParent((prev) => {
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
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setEditParentModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="editParentForm" loading={isLoading} type="submit">
                    Save
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditStudentsParent.propTypes = {
    student: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditParentModalVisibility: PropTypes.func.isRequired,
    savedStudentCallBack: PropTypes.func.isRequired,
};