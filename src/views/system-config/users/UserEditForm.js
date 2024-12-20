/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CLoadingButton,
    CMultiSelect,
    CFormText,
    CFormSelect,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilChevronCircleDownAlt, cilChevronCircleUpAlt, cilLockLocked, cilPhone, cilUser, cilWc } from '@coreui/icons';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import UsersService from 'src/api/system-config/users/users.service';
import PropTypes from 'prop-types';
import counryCodes from 'src/assets/iso/country-codes.json';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';

export default function UserEditForm({ user, visibility, setEditUserModalVisibility, savedUserCallBack }) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const usernameRef = useRef();
    const errorRef = useRef();

    const usersNames = user.name.split(' ');

    const defaultUser = {
        id: user.id,
        username: user.username,
        firstName: usersNames[0],
        lastName: usersNames[usersNames.length - 1],
        gender: user.gender,
        middleName: usersNames.length === 3 ? usersNames[1] : '',
        phoneNumber: user.phoneNumber,
        fullPhoneNumber: user.fullPhoneNumber,
        email: user.email,
        roles: user.roles,
    };

    const [allUserRoles, setAllUserRoles] = useState([]);
    const [genderOptions, setGenderOptions] = useState([]);
    const [isEditUserFormValidated, setIsEditUserFormValidated] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [isValidMatchPassword, setIsValidMatchPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedUser, setEditedUser] = useState(defaultUser);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    useEffect(() => {
        const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setIsValidEmail(EMAIL_REGEX.test(editedUser.email));
    }, [editedUser.email]);

    useEffect(() => {
        const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,24}$/;
        setIsValidPassword(PASSWORD_REGEX.test(editedUser.password));
        if (confirmPassword !== '') {
            setIsValidMatchPassword(confirmPassword === editedUser.password);
        }
    }, [confirmPassword, editedUser.password]);

    useEffect(() => {
        setAllUserRoles(() => {
            return UsersService.getAllUserRoles().map((role) => {
                if (editedUser.roles.includes(role.value)) {
                    return {
                        value: role.value,
                        label: role.label,
                        selected: true,
                    };
                }
                return role;
            });
        });
    }, []);

    useEffect(() => {
        setGenderOptions(() => {
            return UsersService.getGenderOptions().map((genderOption) => {
                if (editedUser.gender === genderOption.value) {
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

    const handleSaveUser = async (event) => {
        const editUserForm = event.currentTarget;

        if (editUserForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await UsersService.editUser(editedUser, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setConfirmPassword('');
                    setEditUserModalVisibility(!visibility);
                    savedUserCallBack(response);
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
        setIsEditUserFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditUserModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Edit User</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the user. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditUserFormValidated}
                                        onSubmit={handleSaveUser}
                                        id="editUserForm"
                                    >
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="usernameInputGroup">
                                                <CIcon icon={cilUser} title="Username" />
                                            </CInputGroupText>
                                            <CFormInput
                                                autoComplete="off"
                                                id="username"
                                                required
                                                ref={usernameRef}
                                                value={editedUser.username}
                                                disabled
                                                aria-describedby="usernameInputGroup"
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} title="First Name" />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder="First Name"
                                                autoComplete="firstname"
                                                id="firstname"
                                                required
                                                value={editedUser.firstName}
                                                onChange={(e) => {
                                                    setEditedUser((prev) => {
                                                        return {
                                                            ...prev,
                                                            firstName: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} title="Middle Name" />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder="Middle Name"
                                                autoComplete="middlename"
                                                id="middlename"
                                                value={editedUser.middleName}
                                                onChange={(e) => {
                                                    setEditedUser((prev) => {
                                                        return {
                                                            ...prev,
                                                            middleName: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} title="Last Name" />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder="Last Name"
                                                autoComplete="lastname"
                                                id="lastname"
                                                required
                                                value={editedUser.lastName}
                                                onChange={(e) => {
                                                    setEditedUser((prev) => {
                                                        return {
                                                            ...prev,
                                                            lastName: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilWc} />
                                            </CInputGroupText>
                                            <CFormSelect
                                                placeholder="Select gender..."
                                                autoComplete="off"
                                                options={genderOptions}
                                                id="gender"
                                                required
                                                feedbackInvalid="Select a gender option."
                                                value={editedUser.gender}
                                                onChange={(e) => {
                                                    setEditedUser((prev) => {
                                                        return {
                                                            ...prev,
                                                            gender: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilPhone} title="Phone Number" />
                                            </CInputGroupText>
                                            <CCol xs="4" sm="4" md="4">
                                                <CFormSelect
                                                    className="rounded-0"
                                                    id="countryCodes"
                                                    value={editedUser.phoneNumber?.countryCode ?? '+260'}
                                                    onChange={(e) => {
                                                        setEditedUser((prev) => {
                                                            return {
                                                                ...prev,
                                                                phoneNumber: {
                                                                    number: prev.phoneNumber?.number ?? '',
                                                                    countryCode: e.target.value,
                                                                },
                                                            };
                                                        });
                                                    }}
                                                >
                                                    {counryCodes.map((countryCode) => {
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
                                                value={editedUser.phoneNumber?.number ?? ''}
                                                onChange={(e) => {
                                                    setEditedUser((prev) => {
                                                        return {
                                                            ...prev,
                                                            phoneNumber: {
                                                                number: e.target.value,
                                                                countryCode: prev.phoneNumber?.countryCode ?? '+260',
                                                            },
                                                        };
                                                    });
                                                }}
                                                placeholder="Phone Number"
                                            />
                                        </CInputGroup>
                                        <CMultiSelect
                                            className="mb-3"
                                            options={allUserRoles}
                                            placeholder="Select user roles..."
                                            required
                                            feedbackInvalid="Select at least one user role."
                                            onChange={(selectedUserRoles) => {
                                                setEditedUser((prev) => {
                                                    const selectedUserRolesValues = selectedUserRoles.map(
                                                        (selectedUserRole) => {
                                                            return selectedUserRole.value;
                                                        },
                                                    );
                                                    return {
                                                        ...prev,
                                                        roles: selectedUserRolesValues,
                                                    };
                                                });
                                            }}
                                        />
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText title="Email">@</CInputGroupText>
                                            <CFormInput
                                                type="email"
                                                placeholder="Email"
                                                autoComplete="email"
                                                id="email"
                                                required
                                                value={editedUser.email}
                                                valid={isValidEmail}
                                                invalid={!!editedUser.email && !isValidEmail}
                                                feedbackInvalid="Please enter a valid email address."
                                                onChange={(e) => {
                                                    setEditedUser((prev) => {
                                                        return {
                                                            ...prev,
                                                            email: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        {showPasswordFields && (
                                            <>
                                                <CInputGroup className="mb-3">
                                                    <CInputGroupText>
                                                        <CIcon icon={cilLockLocked} />
                                                    </CInputGroupText>
                                                    <CFormInput
                                                        type="password"
                                                        placeholder="Password"
                                                        autoComplete="off"
                                                        id="newPassword"
                                                        required
                                                        feedbackInvalid="Password should be at least 8 characters, alphanumeric, contaning lower and uppercase letters, and a special charater (!, @, #, $, %)"
                                                        valid={isValidPassword}
                                                        invalid={!!editedUser.password && !isValidPassword}
                                                        value={editedUser.password}
                                                        onChange={(e) => {
                                                            setEditedUser((prev) => {
                                                                return {
                                                                    ...prev,
                                                                    password: e.target.value,
                                                                };
                                                            });
                                                        }}
                                                    />
                                                </CInputGroup>
                                                <CInputGroup className="mb-3">
                                                    <CInputGroupText>
                                                        <CIcon icon={cilLockLocked} />
                                                    </CInputGroupText>
                                                    <CFormInput
                                                        type="password"
                                                        placeholder="Confirm password"
                                                        autoComplete="off"
                                                        id="confirmPassword"
                                                        required
                                                        feedbackInvalid="Passwords do not match."
                                                        valid={isValidMatchPassword}
                                                        invalid={!!confirmPassword && !isValidMatchPassword}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </CInputGroup>
                                            </>
                                        )}

                                        <CButton
                                            color="primary"
                                            variant="ghost"
                                            shape="square"
                                            size="sm"
                                            onClick={() => {
                                                setShowPasswordFields(!showPasswordFields);
                                                if (!showPasswordFields) {
                                                    setEditedUser((prev) => {
                                                        return {
                                                            ...prev,
                                                            password: '',
                                                        };
                                                    });
                                                }
                                            }}
                                        >
                                            {showPasswordFields ? (
                                                <>
                                                    <span>
                                                        <CIcon
                                                            icon={cilChevronCircleUpAlt}
                                                            title="Hide password fields"
                                                        />
                                                    </span>{' '}
                                                    Cancel user password update
                                                </>
                                            ) : (
                                                <>
                                                    <CIcon
                                                        icon={cilChevronCircleDownAlt}
                                                        title="Show password fields"
                                                    />{' '}
                                                    Update user password
                                                </>
                                            )}
                                        </CButton>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setEditUserModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton color="primary" form="editUserForm" loading={isLoading} type="submit">
                    Save user
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

UserEditForm.propTypes = {
    user: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditUserModalVisibility: PropTypes.func.isRequired,
    savedUserCallBack: PropTypes.func,
};
