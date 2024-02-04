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
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import UsersService from 'src/api/system-config/users/users.service';
import PropTypes from 'prop-types';

export default function UserRegistrationForm({
    visibility,
    setUserModalVisibility,
    createdUserCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const usernameRef = useRef();
    const errorRef = useRef();
    const defaultUser = {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userRoles: [],
    };

    const [allUserRoles, setAllUserRoles] = useState([]);
    const [isCreateUserFormValidated, setIsCreateUserFormValidated] = useState(false);
    const [isValidUsername, setIsValidUsername] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [isValidMatchPassword, setIsValidMatchPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newUser, setNewUser] = useState(defaultUser);
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    useEffect(() => {
        const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
        setIsValidUsername(USERNAME_REGEX.test(newUser.username));
    }, [newUser.username]);

    useEffect(() => {
        const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setIsValidEmail(EMAIL_REGEX.test(newUser.email));
    }, [newUser.email]);

    useEffect(() => {
        const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,24}$/;
        setIsValidPassword(PASSWORD_REGEX.test(newUser.password));
        if (confirmPassword !== '') {
            setIsValidMatchPassword(confirmPassword === newUser.password);
        }
    }, [confirmPassword, newUser.password]);

    useEffect(() => {
        setAllUserRoles(UsersService.getAllUserRoles());
    }, []);

    const handleCreateUser = async (event) => {
        const newUserForm = event.currentTarget;

        if (newUserForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await UsersService.createUser(newUser, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setNewUser(defaultUser);
                    setConfirmPassword('');
                    setUserModalVisibility(!visibility);
                    createdUserCallBack(response);
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
        setIsCreateUserFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setUserModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New User</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the user. Please try
                                            again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateUserFormValidated}
                                        onSubmit={handleCreateUser}
                                        id="createNewUserForm"
                                    >
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText id="usernameInputGroup">
                                                <CIcon icon={cilUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder="Username"
                                                autoComplete="off"
                                                id="username"
                                                required
                                                ref={usernameRef}
                                                value={newUser.username}
                                                valid={isValidUsername}
                                                invalid={!!newUser.username && !isValidUsername}
                                                aria-describedby="usernameInputGroup"
                                                feedbackInvalid="Username must contain at least 4 characters."
                                                onChange={(e) => {
                                                    setNewUser((prev) => {
                                                        return {
                                                            ...prev,
                                                            username: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder="First Name"
                                                autoComplete="firstname"
                                                id="firstname"
                                                required
                                                value={newUser.firstName}
                                                onChange={(e) => {
                                                    setNewUser((prev) => {
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
                                                <CIcon icon={cilUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder="Last Name"
                                                autoComplete="lastname"
                                                id="lastname"
                                                required
                                                value={newUser.lastName}
                                                onChange={(e) => {
                                                    setNewUser((prev) => {
                                                        return {
                                                            ...prev,
                                                            lastName: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CMultiSelect
                                                options={allUserRoles}
                                                placeholder="Select user roles..."
                                                required
                                                feedbackInvalid="Select at least one user role."
                                                onChange={(selectedUserRoles) => {
                                                    setNewUser((prev) => {
                                                        const selectedUserRolesValues =
                                                            selectedUserRoles.map(
                                                                (selectedUserRole) => {
                                                                    return selectedUserRole.value;
                                                                },
                                                            );
                                                        return {
                                                            ...prev,
                                                            userRoles: selectedUserRolesValues,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>@</CInputGroupText>
                                            <CFormInput
                                                type="email"
                                                placeholder="Email"
                                                autoComplete="email"
                                                id="email"
                                                required
                                                value={newUser.email}
                                                valid={isValidEmail}
                                                invalid={!!newUser.email && !isValidEmail}
                                                feedbackInvalid="Please enter a valid email address."
                                                onChange={(e) => {
                                                    setNewUser((prev) => {
                                                        return {
                                                            ...prev,
                                                            email: e.target.value,
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
                                                placeholder="Password"
                                                autoComplete="off"
                                                id="newPassword"
                                                required
                                                feedbackInvalid="Password should be at least 8 characters, alphanumeric, contaning lower and uppercase letters, and a special charater (!, @, #, $, %)"
                                                valid={isValidPassword}
                                                invalid={!!newUser.password && !isValidPassword}
                                                value={newUser.password}
                                                onChange={(e) => {
                                                    setNewUser((prev) => {
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
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setUserModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="createNewUserForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save user
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

UserRegistrationForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setUserModalVisibility: PropTypes.func.isRequired,
    createdUserCallBack: PropTypes.func.isRequired,
};
