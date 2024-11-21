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
    CModalHeader,
    CModalTitle,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import { getFullname } from 'src/components/common/serviceutils';
import StudentsService from 'src/api/sis/students.service';

export default function DeleteStudentsParent({
    student,
    parent,
    visibility,
    setDeleteParentModalVisibility,
    savedStudentCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const fullnameRef = useRef();
    const errorRef = useRef();
    const updatedStudent = {
        id: student.id,
        parents: student.parents,
    };

    const [isDeleteParentFormValidated, setIsDeleteParentFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nameOfParentToDelete, setNameOfParentToDelete] = useState('');
    const [isValidNameOfParentToDelete, setIsValidNameOfParentToDelete] = useState(false);

    useEffect(() => {
        fullnameRef.current.focus();
    }, []);

    useEffect(() => {
        const parentsFullname = getFullname(parent.firstName, parent.middlename, parent.lastName);
        setIsValidNameOfParentToDelete(nameOfParentToDelete === parentsFullname);
    }, [nameOfParentToDelete, parent]);

    const handleDeleteParent = async (event) => {
        const deleteParentForm = event.currentTarget;

        if (deleteParentForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            updatedStudent.parents = updatedStudent.parents.filter((p) => p.id !== parent.id);

            await StudentsService.editStudent(updatedStudent, axiosPrivate, controller, setErrorMessage).then(
                (response) => {
                    setDeleteParentModalVisibility(!visibility);
                    savedStudentCallBack(response);
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
        setIsDeleteParentFormValidated(true);
    };

    return (
        <CModal
            alignment="center"
            visible={visibility}
            onClose={() => setDeleteParentModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
            size="lg"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Confirm Delete Parent</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while deleting the user. Please try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isDeleteParentFormValidated}
                                        onSubmit={handleDeleteParent}
                                        id="deleteParentForm"
                                    >
                                        <CInputGroup className="mb-3">
                                            <CFormLabel htmlFor="fullname">
                                                Are you sure you want to delete{' '}
                                                <b>
                                                    {getFullname(parent.firstName, parent.middlename, parent.lastName)}
                                                </b>
                                                ? To proceed, type{' '}
                                                <b>
                                                    &quot;{/* */}
                                                    <i>
                                                        {getFullname(
                                                            parent.firstName,
                                                            parent.middlename,
                                                            parent.lastName,
                                                        )}
                                                    </i>
                                                    {/* */}&quot;
                                                </b>{' '}
                                                in the field below.
                                            </CFormLabel>
                                            <CFormInput
                                                autoComplete="off"
                                                id="fullname"
                                                required
                                                ref={fullnameRef}
                                                value={nameOfParentToDelete}
                                                onChange={(event) => setNameOfParentToDelete(event.target.value)}
                                                valid={isValidNameOfParentToDelete}
                                                invalid={!!nameOfParentToDelete && !isValidNameOfParentToDelete}
                                                aria-describedby="confirmNameInputGroup"
                                                feedbackInvalid="The name entered does not match the parent's name"
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
                <CButton color="secondary" onClick={() => setDeleteParentModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="danger"
                    form="deleteParentForm"
                    loading={isLoading}
                    type="submit"
                    disabled={!isValidNameOfParentToDelete}
                >
                    Delete Parent
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

DeleteStudentsParent.propTypes = {
    student: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setDeleteParentModalVisibility: PropTypes.func.isRequired,
    savedStudentCallBack: PropTypes.func,
};
