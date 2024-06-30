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
    CInputGroupText,
} from '@coreui/react-pro';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate.js';
import PropTypes from 'prop-types';
import AssetsService from 'src/api/cashbook/assets.service';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';
import AssetTypesService from 'src/api/system-config/cashbook/asset-types.service';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';

export default function EditAssetForm({
    asset,
    visibility,
    setEditAssetModalVisibility,
    savedAssetCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const assetNameRef = useRef();
    const errorRef = useRef();
    const defaultAsset = {
        assetId: asset.id,
        narration: asset.narration,
        assetTypeId: asset.assetType.assetTypeId,
        paymentMethodId: asset.paymentMethod.paymentMethodId,
        amount: `${asset.amount}`,
    };

    const [isMounted, setIsMounted] = useState(true);
    const [allAssetTypes, setAllAssetTypes] = useState([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState([]);
    const [isEditAssetFormValidated, setIsEditAssetFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [editedAsset, setEditedAsset] = useState(defaultAsset);

    useEffect(() => {
        assetNameRef.current.focus();
    }, [assetNameRef]);

    const getAssetTypes = async () => {
        const assetTypes = await AssetTypesService.getAllAssetTypes(
            axiosPrivate,
            controller,
            setErrorMessage,
        );
        const allAssetTypes = assetTypes.map((assetType) => {
            return { value: assetType.id, label: assetType.name };
        });
        isMounted && setAllAssetTypes(allAssetTypes);
    };

    const assetTypesWithPlaceholder = (assetTypes) => {
        return [{ value: '', label: 'Select asset type...' }, ...assetTypes];
    };

    const paymentMethods = async () => {
        const paymentMethods = await PaymentMethodsService.getAllPaymentMethods(
            axiosPrivate,
            controller,
            setErrorMessage,
        );
        const allPaymentMethods = paymentMethods.map((paymentMethod) => {
            return { value: paymentMethod.id, label: paymentMethod.name };
        });
        isMounted && setAllPaymentMethods(allPaymentMethods);
    };

    const paymentMethodsWithPlaceholder = (paymentMethods) => {
        return [{ value: '', label: 'Select payment method...' }, ...paymentMethods];
    };

    const handleEditAsset = async (event) => {
        const editAssetForm = event.currentTarget;

        if (editAssetForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await AssetsService.editAsset(
                editedAsset,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setEditedAsset(defaultAsset);
                    setEditAssetModalVisibility(!visibility);
                    savedAssetCallBack(response);
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
        setIsEditAssetFormValidated(true);
    };

    useEffect(() => {
        getAssetTypes();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    useEffect(() => {
        paymentMethods();

        return () => {
            setIsMounted(false);
            controller.abort();
        };
    }, []);

    return (
        <CModal
            backdrop="static"
            alignment="center"
            visible={visibility}
            onClose={() => setEditAssetModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Edit Asset</CModalTitle>
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
                                        validated={isEditAssetFormValidated}
                                        onSubmit={handleEditAsset}
                                        id="editAssetForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Enter name"
                                            autoComplete="off"
                                            id="name"
                                            label="Name"
                                            required
                                            ref={assetNameRef}
                                            value={editedAsset.narration}
                                            onChange={(e) => {
                                                setEditedAsset((prev) => {
                                                    return {
                                                        ...prev,
                                                        narration: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select asset type..."
                                            autoComplete="off"
                                            options={assetTypesWithPlaceholder(allAssetTypes)}
                                            id="assetType"
                                            label="Type"
                                            required
                                            value={editedAsset.assetTypeId}
                                            onChange={(e) => {
                                                setEditedAsset((prev) => {
                                                    return {
                                                        ...prev,
                                                        assetTypeId: e.target.value,
                                                    };
                                                });
                                            }}
                                        />
                                        <CFormLabel>Amount</CFormLabel>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>ZMW</CInputGroupText>
                                            <CFormInputWithMask
                                                mask={parseFloat}
                                                placeholder="Amount"
                                                autoComplete="off"
                                                id="amount"
                                                required
                                                type="number"
                                                value={editedAsset.amount}
                                                onChange={(e) => {
                                                    setEditedAsset((prev) => {
                                                        return {
                                                            ...prev,
                                                            amount: e.target.value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </CInputGroup>
                                        <CFormSelect
                                            className="mb-3"
                                            placeholder="Select payment method..."
                                            autoComplete="off"
                                            options={paymentMethodsWithPlaceholder(
                                                allPaymentMethods,
                                            )}
                                            id="paymentMethod"
                                            label="Payment Method"
                                            required
                                            value={editedAsset.paymentMethodId}
                                            onChange={(e) => {
                                                setEditedAsset((prev) => {
                                                    return {
                                                        ...prev,
                                                        paymentMethodId: e.target.value,
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
                <CButton color="secondary" onClick={() => setEditAssetModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="editAssetForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Asset
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

EditAssetForm.propTypes = {
    asset: PropTypes.object.isRequired,
    visibility: PropTypes.bool.isRequired,
    setEditAssetModalVisibility: PropTypes.func.isRequired,
    savedAssetCallBack: PropTypes.func.isRequired,
};
