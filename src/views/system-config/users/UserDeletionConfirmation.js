import React, { useEffect, useRef, useState } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CInputGroup,
    CFormInput,
    CFormLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CRow,
    CLoadingButton,
    CFormText,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import UsersService from 'src/api/system-config/users/users.service';
import PropTypes from 'prop-types';

export default function UserDeletionConfirmation({
    user,
    visibility,
    setDeleteUserModalVisibility,
    savedUserCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const fullnameRef = useRef();
    const errorRef = useRef();

    const [isEditUserFormValidated, setIsEditUserFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nameOfUserToDelete, setNameOfUserToDelete] = useState('');
    const [isValidNameOfUserToDelete, setIsValidNameOfUserToDelete] = useState(false);

    useEffect(() => {
        fullnameRef.current.focus();
    }, []);

    useEffect(() => {
        setIsValidNameOfUserToDelete(nameOfUserToDelete === user.name);
    }, [nameOfUserToDelete, user.name]);

    const handleDeleteUser = async (event) => {
        const editUserForm = event.currentTarget;

        if (editUserForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await UsersService.deleteUser(user.id, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setDeleteUserModalVisibility(!visibility);
                    savedUserCallBack(user.name, response);
                    setNameOfUserToDelete('');
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
            alignment="center"
            visible={visibility}
            onClose={() => setDeleteUserModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            {/* <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Delete User</CModalTitle>
            </CModalHeader> */}
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while deleting the user. Please try
                                            again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditUserFormValidated}
                                        onSubmit={handleDeleteUser}
                                        id="deleteUserForm"
                                    >
                                        <CInputGroup className="mb-3">
                                            <CFormLabel htmlFor="fullname">
                                                Are you sure you want to delete <b>{user.name}</b>?
                                                To proceed, type{' '}
                                                <b>
                                                    &quot;<i>{user.name}</i>&quot;
                                                </b>{' '}
                                                in the field below.
                                            </CFormLabel>
                                            <CFormInput
                                                autoComplete="off"
                                                id="fullname"
                                                required
                                                ref={fullnameRef}
                                                value={nameOfUserToDelete}
                                                onChange={(event) =>
                                                    setNameOfUserToDelete(event.target.value)
                                                }
                                                valid={isValidNameOfUserToDelete}
                                                invalid={
                                                    !!nameOfUserToDelete &&
                                                    !isValidNameOfUserToDelete
                                                }
                                                aria-describedby="confirmNameInputGroup"
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
                <CButton color="secondary" onClick={() => setDeleteUserModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="danger"
                    form="deleteUserForm"
                    loading={isLoading}
                    type="submit"
                >
                    Delete user
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

UserDeletionConfirmation.propTypes = {
    user: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setDeleteUserModalVisibility: PropTypes.func.isRequired,
    savedUserCallBack: PropTypes.func,
};
