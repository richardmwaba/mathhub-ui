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
import UsersService from 'src/api/system-config/users/users.service';
import countryDialCodes from 'src/assets/iso/country-codes.json';
import zambianProvinces from 'src/assets/iso/zambian-provinces.json';
import { CFormInputWithMask } from '../common/CFormInputWithMask';
import StudentsService from 'src/api/sis/students.service';
import { getCities, privincesOptions } from 'src/components/common/serviceutils';

export default function AddStudentsParent({ student, visibility, setAddParentModalVisibility, savedStudentCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const parentNameRef = useRef();
    const errorRef = useRef();
    const defaultParent = {
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        email: '',
        address: {
            type: 'HOME',
            firstAddressLine: '',
            secondAddressLine: '',
            thirdAddressLine: '',
            city: '',
            province: '',
            zipCode: '',
        },
        phoneNumber: {
            type: 'MOBILE',
            countryCode: '+260',
            number: '',
        },
    };

    const [isAddParentFormValidated, setIsAddParentFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newParent, setNewParent] = useState(defaultParent);
    const [genderOptions, setGenderOptions] = useState([]);

    const handleAddParent = async (event) => {
        const addParentForm = event.currentTarget;

        if (addParentForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            // Add new parent to the student's parents list
            student.parents.push(newParent);

            await StudentsService.editStudent(student, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setAddParentModalVisibility(!visibility);
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
        setIsAddParentFormValidated(true);
    };

    useEffect(() => {
        parentNameRef.current.focus();
    }, [parentNameRef]);

    useEffect(() => {
        setGenderOptions(() => {
            return UsersService.getGenderOptions().map((genderOption) => {
                if (newParent.gender === genderOption.value) {
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
        setIsValidEmail(EMAIL_REGEX.test(newParent.email));
    }, [newParent.email]);

    useEffect(() => {
        console.log('New Parent:', newParent);
    });

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setAddParentModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">
                    Add {student.firstName}&rsquo;s New Parents/Guardians Info
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
                                        validated={isAddParentFormValidated}
                                        onSubmit={handleAddParent}
                                        id="addParentForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Parent's First Name"
                                            autoComplete="off"
                                            id="firstName"
                                            label="First Name"
                                            required
                                            ref={parentNameRef}
                                            value={newParent.firstName}
                                            aria-describedby="firstNameInputGroup"
                                            onChange={(e) => {
                                                setNewParent((prev) => {
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
                                            value={newParent.middleName}
                                            aria-describedby="middleNameInputGroup"
                                            onChange={(e) => {
                                                setNewParent((prev) => {
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
                                            value={newParent.lastName}
                                            onChange={(e) => {
                                                setNewParent((prev) => {
                                                    return {
                                                        ...prev,
                                                        lastName: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CCol className="mb-3">
                                            <CFormSelect
                                                placeholder="Select gender..."
                                                autoComplete="off"
                                                label="Gender"
                                                options={genderOptions}
                                                id="gender"
                                                required
                                                feedbackInvalid="Select valid gender."
                                                value={newParent.gender}
                                                onChange={(e) => {
                                                    setNewParent((prev) => {
                                                        return {
                                                            ...prev,
                                                            gender: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CCol>
                                        <CCol className="mb-3">
                                            <CFormInput
                                                aria-describedby="emailInputGroup"
                                                placeholder="Parent's Email"
                                                autoComplete="off"
                                                id="email"
                                                label="Email"
                                                required
                                                type="email"
                                                value={newParent.email}
                                                valid={isValidEmail}
                                                invalid={!!newParent.email && !isValidEmail}
                                                feedbackInvalid="Please enter a valid email address."
                                                onChange={(e) => {
                                                    setNewParent((prev) => {
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
                                                    value={newParent.phoneNumber?.countryCode ?? '+260'}
                                                    onChange={(e) => {
                                                        setNewParent((prev) => {
                                                            return {
                                                                ...prev,
                                                                phoneNumber: {
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
                                                value={newParent.phoneNumber?.number ?? ''}
                                                onChange={(e) => {
                                                    setNewParent((prev) => {
                                                        return {
                                                            ...prev,
                                                            phoneNumber: {
                                                                number: e.target.value,
                                                                type: prev.phoneNumber?.type ?? 'MOBILE',
                                                            },
                                                        };
                                                    });
                                                }}
                                                placeholder="Phone Number"
                                                required
                                            />
                                        </CInputGroup>
                                        <CFormLabel htmlFor="address">Address</CFormLabel>
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Street address"
                                            autoComplete="off"
                                            id="streetAddress"
                                            value={newParent.address.firstAddressLine}
                                            aria-describedby="streetAddress"
                                            onChange={(e) => {
                                                setNewParent((prev) => {
                                                    return {
                                                        ...prev,
                                                        address: {
                                                            ...prev.address,
                                                            firstAddressLine: e.target.value,
                                                        },
                                                    };
                                                });
                                            }}
                                            required
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Apt, suite, etc. (optional)"
                                            autoComplete="off"
                                            id="secondAddressLine"
                                            value={newParent.address.secondAddressLine}
                                            aria-describedby="secondAddressLine"
                                            onChange={(e) => {
                                                setNewParent((prev) => {
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
                                                value={newParent.address.province}
                                                options={privincesOptions()}
                                                aria-describedby="province"
                                                feedbackInvalid="Select valid province."
                                                onChange={(e) => {
                                                    setNewParent((prev) => {
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
                                                value={newParent.address.city ?? 'Lusaka'}
                                                aria-describedby="city"
                                                options={getCities(zambianProvinces, newParent.address.province)}
                                                onChange={(e) => {
                                                    setNewParent((prev) => {
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
                <CButton color="secondary" onClick={() => setAddParentModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="addParentForm" loading={isLoading} type="submit">
                    Save
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

AddStudentsParent.propTypes = {
    student: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setAddParentModalVisibility: PropTypes.func.isRequired,
    savedStudentCallBack: PropTypes.func.isRequired,
};
