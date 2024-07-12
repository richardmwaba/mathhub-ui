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
import EquityTypesService from 'src/api/system-config/cashbook/equity-types.service';

export default function EditEquityTypeForm({
    equityType,
    visibility,
    setEditEquityTypeModalVisibility,
    savedEquityTypeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const equityTypeNameRef = useRef();
    const errorRef = useRef();
    const defaultEquityType = {
        id: equityType.id,
        name: equityType.name,
        description: equityType.description,
    };

    const [isEditEquityTypeFormValidated, setIsEditEquityTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedEquityType, setEditedEquityType] = useState(defaultEquityType);

    useEffect(() => {
        equityTypeNameRef.current.focus();
    }, [equityTypeNameRef]);

    const handleEditEquityType = async (event) => {
        const editEquityTypeForm = event.currentTarget;

        if (editEquityTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await EquityTypesService.editEquityType(
                editedEquityType,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedEquityType(defaultEquityType);
                    setEditEquityTypeModalVisibility(!visibility);
                    savedEquityTypeCallBack(response);
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
        setIsEditEquityTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditEquityTypeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Equity Type</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the equity type. Please
                                            try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditEquityTypeFormValidated}
                                        onSubmit={handleEditEquityType}
                                        id="editEquityTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Equity Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={equityTypeNameRef}
                                            value={editedEquityType.name}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setEditedEquityType((prev) => {
                                                    return {
                                                        ...prev,
                                                        name: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Equity Type Description"
                                            autoComplete="off"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={editedEquityType.description}
                                            onChange={(e) => {
                                                setEditedEquityType((prev) => {
                                                    return {
                                                        ...prev,
                                                        description: e.target.value,
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
                <CButton color="secondary" onClick={() => setEditEquityTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="editEquityTypeForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Equity Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditEquityTypeForm.propTypes = {
    equityType: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditEquityTypeModalVisibility: PropTypes.func.isRequired,
    savedEquityTypeCallBack: PropTypes.func.isRequired,
};
