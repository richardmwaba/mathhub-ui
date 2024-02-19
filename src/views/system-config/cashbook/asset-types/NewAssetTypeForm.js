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
import AssetTypesService from 'src/api/system-config/cashbook/asset-types.service';

export default function NewAssetTypeForm({
    visibility,
    setAssetTypeModalVisibility,
    createdAssetTypeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const typeNameRef = useRef();
    const errorRef = useRef();
    const defaultAssetType = {
        typeName: '',
        typeDescription: '',
    };

    const [isCreateAssetTypeFormValidated, setIsCreateAssetTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newAssetType, setNewAssetType] = useState(defaultAssetType);

    useEffect(() => {
        typeNameRef.current.focus();
    }, []);

    const handleCreateNewAssetType = async (event) => {
        const newAssetTypeForm = event.currentTarget;

        if (newAssetTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await AssetTypesService.createAssetType(
                newAssetType,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setNewAssetType(defaultAssetType);
                    setAssetTypeModalVisibility(!visibility);
                    createdAssetTypeCallBack(response);
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
        setIsCreateAssetTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setAssetTypeModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Asset Type</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new asset type. Please
                                            try again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateAssetTypeFormValidated}
                                        onSubmit={handleCreateNewAssetType}
                                        id="createNewAssetTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={typeNameRef}
                                            value={newAssetType.typeName}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setNewAssetType((prev) => {
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
                                            value={newAssetType.typeDescription}
                                            onChange={(e) => {
                                                setNewAssetType((prev) => {
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
                <CButton color="secondary" onClick={() => setAssetTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="createNewAssetTypeForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Asset Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewAssetTypeForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setAssetTypeModalVisibility: PropTypes.func.isRequired,
    createdAssetTypeCallBack: PropTypes.func.isRequired,
};
