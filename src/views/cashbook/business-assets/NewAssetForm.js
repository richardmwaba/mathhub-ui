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
import AssetTypesService from 'src/api/system-config/cashbook/asset-types.service';
import PaymentMethodsService from 'src/api/system-config/cashbook/payment-methods.service';
import { CFormInputWithMask } from 'src/views/common/CFormInputWithMask';

export default function NewAssetForm({
    visibility,
    setAssetModalVisibility,
    createdAssetCallBack,
}) {
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const assetNameRef = useRef();
    const errorRef = useRef();
    const defaultAsset = {
        narration: '',
        assetTypeId: '',
        paymentMethodId: '',
        amount: '',
    };

    const [isMounted, setIsMounted] = useState(true);
    const [allAssetTypes, setAllAssetTypes] = useState([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState([]);
    const [isCreateAssetFormValidated, setIsCreateAssetFormValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newAsset, setNewAsset] = useState(defaultAsset);

    useEffect(() => {
        assetNameRef.current.focus();
    }, []);

    const getAssetTypes = async () => {
        const assetTypes = await AssetTypesService.getAllAssetTypes(
            axiosPrivate,
            controller,
            setErrorMessage,
        );
        const allAssetTypes = assetTypes.map((assetType) => {
            return { value: assetType.id, label: assetType.name };
        });
        const assetTypesWithPlaceholder = [
            { value: '', label: 'Select asset type...' },
            ...allAssetTypes,
        ];
        isMounted && setAllAssetTypes(assetTypesWithPlaceholder);
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
        const paymentMethodsWithPlaceholder = [
            { value: '', label: 'Select payment method...' },
            ...allPaymentMethods,
        ];
        isMounted && setAllPaymentMethods(paymentMethodsWithPlaceholder);
    };

    const handleCreateNewAsset = async (event) => {
        const newAssetForm = event.currentTarget;

        if (newAssetForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            setErrorMessage('');
            setIsLoading(true);

            await AssetsService.createAsset(
                newAsset,
                axiosPrivate,
                controller,
                setErrorMessage,
            ).then(
                (response) => {
                    setNewAsset(defaultAsset);
                    setAssetModalVisibility(!visibility);
                    createdAssetCallBack(response);
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
        setIsCreateAssetFormValidated(true);
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
            onClose={() => setAssetModalVisibility(!visibility)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">New Asset</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={12} lg={12} xl={12}>
                            <CCard className="mx-2">
                                <CCardBody className="p-4">
                                    {errorMessage && (
                                        <CFormText className="mb-3" style={{ color: 'red' }}>
                                            An error occured while saving the new asset. Please try
                                            again!
                                        </CFormText>
                                    )}
                                    <CForm
                                        className="needs-validation"
                                        noValidate
                                        validated={isCreateAssetFormValidated}
                                        onSubmit={handleCreateNewAsset}
                                        id="createNewAssetForm"
                                    >
                                        <CFormInput
                                            className="mb-3"
                                            placeholder="Enter name"
                                            autoComplete="off"
                                            id="name"
                                            label="Name"
                                            required
                                            ref={assetNameRef}
                                            value={newAsset.narration}
                                            onChange={(e) => {
                                                setNewAsset((prev) => {
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
                                            options={allAssetTypes}
                                            id="assetType"
                                            label="Type"
                                            required
                                            value={newAsset.assetTypeId}
                                            onChange={(e) => {
                                                setNewAsset((prev) => {
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
                                                value={newAsset.amount}
                                                onChange={(e) => {
                                                    setNewAsset((prev) => {
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
                                            options={allPaymentMethods}
                                            id="paymentMethod"
                                            label="Payment Method"
                                            required
                                            value={newAsset.paymentMethodId}
                                            onChange={(e) => {
                                                setNewAsset((prev) => {
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
                <CButton color="secondary" onClick={() => setAssetModalVisibility(false)}>
                    Cancel
                </CButton>
                <CLoadingButton
                    color="primary"
                    form="createNewAssetForm"
                    loading={isLoading}
                    type="submit"
                >
                    Save Asset
                </CLoadingButton>
            </CModalFooter>
        </CModal>
    );
}

NewAssetForm.propTypes = {
    visibility: PropTypes.bool.isRequired,
    setAssetModalVisibility: PropTypes.func.isRequired,
    createdAssetCallBack: PropTypes.func.isRequired,
};
