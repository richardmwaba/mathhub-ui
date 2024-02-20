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

export default function EditAssetTypeForm({
    assetType,
    visibility,
    setEditAssetTypeModalVisibility,
    savedAssetTypeCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const assetTypeNameRef = useRef();
    const errorRef = useRef();
    const defaultAssetType = {
        assetTypeId: assetType.id,
        typeName: assetType.name,
        typeDescription: assetType.description,
    };

    const [isEditAssetTypeFormValidated, setIsEditAssetTypeFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedAssetType, setEditedAssetType] = useState(defaultAssetType);

    useEffect(() => {
        assetTypeNameRef.current.focus();
    }, [assetTypeNameRef]);

    const handleEditAssetType = async (event) => {
        const editAssetTypeForm = event.currentTarget;

        if (editAssetTypeForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await AssetTypesService.editAssetType(
                editedAssetType,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedAssetType(defaultAssetType);
                    setEditAssetTypeModalVisibility(!visibility);
                    savedAssetTypeCallBack(response);
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
        setIsEditAssetTypeFormValidated(true);
    };

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditAssetTypeModalVisibility(!visibility)}
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
                                            An error occured while saving the asset type. Please try
                                            again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isEditAssetTypeFormValidated}
                                        onSubmit={handleEditAssetType}
                                        id="editAssetTypeForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Asset Type Name"
                                            autoComplete="off"
                                            id="typeName"
                                            label="Name"
                                            required
                                            ref={assetTypeNameRef}
                                            value={editedAssetType.typeName}
                                            aria-describedby="typeNameInputGroup"
                                            onChange={(e) => {
                                                setEditedAssetType((prev) => {
                                                    return {
                                                        ...prev,
                                                        typeName: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Asset Type Description"
                                            autoComplete="off"
                                            id="typeDescription"
                                            label="Description"
                                            required
                                            value={editedAssetType.typeDescription}
                                            onChange={(e) => {
                                                setEditedAssetType((prev) => {
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
                <CButton color="secondary" onClick={() => setEditAssetTypeModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="editAssetTypeForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Asset Type
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditAssetTypeForm.propTypes = {
    assetType: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditAssetTypeModalVisibility: PropTypes.func.isRequired,
    savedAssetTypeCallBack: PropTypes.func.isRequired,
};
