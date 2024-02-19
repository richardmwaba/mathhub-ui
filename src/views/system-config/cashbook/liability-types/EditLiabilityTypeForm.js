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
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import LiabilityTypesService from 'src/api/system-config/cashbook/liability-types.service';

export default function EditLiabilityTypeForm({
    liabilityType,
    visibility,
    setEditLiabilityTypeModalVisibility,
    savedLiabilityTypeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const typeNameRef = useRef();
    const errorRef = useRef();
    const defaultLiabilityType = {
        liabilityTypeId: liabilityType.id,
        typeName: liabilityType.name,
        typeDescription: liabilityType.description,
    };

    const [isEditLiabilityTypeFormValidated, setIsEditLiabilityTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedLiabilityType, setEditedLiabilityType] = useState(defaultLiabilityType);

    useEffect(() => {
        typeNameRef.current.focus();
    }, [typeNameRef]);

    const handleEditLiabilityType = async (event) => {
        const editLiabilityTypeForm = event.currentTarget;

        if (editLiabilityTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await LiabilityTypesService.editLiabilityType(
                editedLiabilityType,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedLiabilityType(defaultLiabilityType);
                    setEditLiabilityTypeModalVisibility(!visibility);
                    savedLiabilityTypeCallBack(response);
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
        setIsEditLiabilityTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditLiabilityTypeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Liability Type</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the liability type. Please
                                            try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditLiabilityTypeFormValidated}
                                        onSubmit={handleEditLiabilityType}
                                        id="editLiabilityTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={typeNameRef}
                                            value={editedLiabilityType.typeName}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setEditedLiabilityType((prev) => {
                                                    return {
                                                        ...prev,
                                                        typeName: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Type Description"
                                            autoComplete="tyepDescription"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={editedLiabilityType.typeDescription}
                                            onChange={(e) => {
                                                setEditedLiabilityType((prev) => {
                                                    return {
                                                        ...prev,
                                                        typeDescription: e.target.value,
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
                <CButton
                    color="secondary"
                    onClick={() => setEditLiabilityTypeModalVisibility(false)}
                >
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="editLiabilityTypeForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Liability Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditLiabilityTypeForm.propTypes = {
    liabilityType: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditLiabilityTypeModalVisibility: PropTypes.func.isRequired,
    savedLiabilityTypeCallBack: PropTypes.func.isRequired,
};
